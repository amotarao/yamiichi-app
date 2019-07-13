import { WebClient } from '@slack/web-api';
import { generateBiderPriceList } from './bider';
import { OfferItemDataInterface, OfferItemRegistrationInterface } from './interfaces';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface postCreateOfferProps {
  channel: string;
  id: string;
  authorId: string;
  periodDate: Date;
  item: Omit<OfferItemRegistrationInterface, 'tmp'>;
}

export const postCreateOffer = (client: WebClient, { channel, id, authorId, periodDate, item }: postCreateOfferProps) => {
  const author = authorId;

  const blocks = [
    ...generateTitles({ ...item }),
    ...generateOfferFields({ ...item, author, currentPrice: -1 }),
    ...generateMetaInfos({ periodDate }),
    ...generateBidActions({ ...item, currentPrice: -1, id }),
  ];

  return client.chat.postMessage({
    text: generateText({ ...item }),
    channel,
    blocks,
  });
};

interface updateOfferProps {
  channel: string;
  ts: string;
  id: string;
  finished?: boolean;
  item: OfferItemDataInterface;
}

export const updateOffer = (client: WebClient, { channel, ts, id, finished = false, item }: updateOfferProps) => {
  const authorMatches = item.authorRef.id.match(/slack:.+-(.+)/);
  const author = authorMatches ? authorMatches[1] : '';

  const lastBidderMatches = item.lastBidderRef!.id.match(/slack:.+-(.+)/);
  const lastBidder = lastBidderMatches ? lastBidderMatches[1] : '';

  const blocks = [
    ...generateTitles({ ...item, finished }),
    ...generateOfferFields({ ...item, author, lastBidder, finished }),
    ...generateMetaInfos({ periodDate: item.periodDate.toDate(), finished }),
  ];

  if (!finished) {
    blocks.push(...generateBidActions({ ...item, id }));
  }

  return client.chat.update({
    text: generateText({ ...item }),
    channel,
    ts,
    blocks,
  });
};

interface postBidOfferProps {
  channel: string;
  thread_ts: string;
  finished?: boolean;
  item: OfferItemDataInterface;
}

export const postBidOffer = (client: WebClient, { channel, thread_ts, finished = false, item }: postBidOfferProps) => {
  const lastBidderMatches = item.lastBidderRef!.id.match(/slack:.+-(.+)/);
  const lastBidder = lastBidderMatches ? lastBidderMatches[1] : '';

  const text = finished
    ? lastBidder
      ? `<@${lastBidder}> が ¥ ${item.currentPrice.toLocaleString()} で落札`
      : '落札者なしで終了しました'
    : `<@${lastBidder}> が ¥ ${item.currentPrice.toLocaleString()} で入札`;

  return client.chat.postMessage({
    text,
    channel,
    thread_ts,
    reply_broadcast: true,
  });
};

/**
 * 罫線
 */
export const divider = {
  type: 'divider',
};

/**
 * テキストを生成する Props
 */
interface generateTextProps {
  title: string;
  finished?: boolean;
}

/**
 * タイトルを生成する
 */
export const generateText = ({ title, finished = false }: generateTextProps) => {
  return finished ? `＜終了＞ *${title}*` : `【開催中】 *${title}*`;
};

/**
 * タイトルを生成する Props
 */
interface generateTitlesProps {
  title: string;
  finished?: boolean;
}

/**
 * タイトルを生成する
 */
export const generateTitles = ({ title, finished = false }: generateTitlesProps) => {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: finished ? `＜終了＞ *${title}*` : `【開催中】 *${title}*`,
      },
    },
  ];
};

/**
 * メタ情報を生成する Props
 */
interface generateMetaInfosProps {
  periodDate: Date;
  finished?: boolean;
}

/**
 * メタ情報を生成する
 */
export const generateMetaInfos = ({ periodDate, finished = false }: generateMetaInfosProps) => {
  const time = Math.floor(periodDate.getTime() / 1000);
  const text = finished
    ? '<https://yamiichi.app/|闇市で簡単出品>'
    : `<!date^${time}^{date} at {time}|${periodDate.toLocaleString()}> に終了\n<https://yamiichi.app/|闇市で簡単出品>`;

  return [
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text,
        },
      ],
    },
  ];
};

/**
 * 商品データを生成する Props
 */
interface generateOfferFieldsProps {
  title: string;
  description?: string;
  author: string;
  lastBidder?: string;
  initialPrice: number;
  currentPrice: number;
  maxPrice: number;
  finished?: boolean;
}

/**
 * 商品データを生成する
 */
export const generateOfferFields = ({
  title,
  description = '',
  author,
  lastBidder = '',
  initialPrice,
  currentPrice,
  maxPrice,
  finished = false,
}: generateOfferFieldsProps) => {
  const fields = [];

  fields.push({
    type: 'mrkdwn',
    text: `商品名\n*${title}*`,
  });

  fields.push({
    type: 'mrkdwn',
    text: `出品者\n*<@${author}>*`,
  });

  if (lastBidder) {
    fields.push({
      type: 'mrkdwn',
      text: finished ? `落札者\n*<@${lastBidder}>*` : `最終入札者\n*<@${lastBidder}>*`,
    });
  }

  if (finished && !lastBidder) {
    fields.push({
      type: 'mrkdwn',
      text: '落札者\n*なし*',
    });
  }

  if (maxPrice >= 0) {
    fields.push({
      type: 'mrkdwn',
      text: `即決価格\n*¥${maxPrice.toLocaleString()}*`,
    });
  }

  if (currentPrice >= 0) {
    fields.push({
      type: 'mrkdwn',
      text: `現在の価格\n*¥${currentPrice.toLocaleString()}*`,
    });
  } else {
    fields.push({
      type: 'mrkdwn',
      text: `開始価格\n*¥${initialPrice.toLocaleString()}*`,
    });
  }

  const section = {
    type: 'section',
    fields,
  };

  if (description) {
    return [
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: description,
          },
        ],
      },
      divider,
      section,
    ];
  }

  return [divider, section];
};

/**
 * 入札アクションを生成する Props
 */
interface generateBidActionsProps {
  id: string;
  title: string;
  initialPrice: number;
  currentPrice: number;
  maxPrice: number;
}

/**
 * 入札アクションを生成する
 */
export const generateBidActions = ({ id, title, initialPrice, currentPrice, maxPrice }: generateBidActionsProps) => {
  const elements = [];

  const priceList = generateBiderPriceList(initialPrice, currentPrice, maxPrice, 5);
  const options = (priceList || []).map((price) => {
    return {
      text: {
        type: 'plain_text',
        text: `¥${price.toLocaleString()}`,
      },
      value: `${id}__${price.toString()}`,
    };
  });

  elements.push({
    type: 'static_select',
    action_id: 'bid_select',
    placeholder: {
      type: 'plain_text',
      text: '価格を選んで入札',
    },
    options,
    confirm: {
      title: {
        type: 'plain_text',
        text: '入札しますか？',
      },
      text: {
        type: 'plain_text',
        text: `${title} を、選択した価格で入札します`,
      },
      confirm: {
        type: 'plain_text',
        text: '入札する',
      },
      deny: {
        type: 'plain_text',
        text: 'キャンセル',
      },
    },
  });

  if (maxPrice >= 0) {
    elements.push({
      type: 'button',
      action_id: 'bid_button',
      text: {
        type: 'plain_text',
        text: '即決価格で落札',
      },
      style: 'primary',
      value: `${id}__${maxPrice.toString()}`,
      confirm: {
        title: {
          type: 'plain_text',
          text: '落札しますか？',
        },
        text: {
          type: 'plain_text',
          text: `${title} を、即決価格 ¥${maxPrice.toLocaleString()} で落札します`,
        },
        confirm: {
          type: 'plain_text',
          text: '落札する',
        },
        deny: {
          type: 'plain_text',
          text: 'キャンセル',
        },
      },
    });
  }

  return [
    {
      type: 'actions',
      elements,
    },
  ];
};
