import { WebClient } from '@slack/web-api';
import { generateBiderPriceList } from './bider';
import { OfferItemDataInterface } from './interfaces';

interface postCreateOfferProps {
  channel: string;
  item: OfferItemDataInterface;
}

export const postCreateOffer = (client: WebClient, { channel, item }: postCreateOfferProps) => {
  const blocks = [
    ...generateTitles({ ...item }),
    ...generateOfferFields({ ...item }),
    ...generateMetaInfos({ ...item }),
    ...generateBidActions({ ...item, currentPrice: -1 }),
  ];

  return client.chat.postMessage({
    text: generateText({ ...item }),
    channel,
    blocks,
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
  isFinished?: boolean;
  item: OfferItemDataInterface;
}

/**
 * タイトルを生成する
 */
export const generateText = ({ isFinished = false, item: { title } }: generateTextProps) => {
  return isFinished ? `＜終了＞ *${title}*` : `【開催中】 *${title}*`;
};

/**
 * タイトルを生成する Props
 */
interface generateTitlesProps {
  isFinished?: boolean;
  item: OfferItemDataInterface;
}

/**
 * タイトルを生成する
 */
export const generateTitles = ({ isFinished = false, item: { title } }: generateTitlesProps) => {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: isFinished ? `＜終了＞ *${title}*` : `【開催中】 *${title}*`,
      },
    },
  ];
};

/**
 * メタ情報を生成する Props
 */
interface generateMetaInfosProps {
  item: OfferItemDataInterface;
}

/**
 * メタ情報を生成する
 */
export const generateMetaInfos = ({ item: { periodDate } }: generateMetaInfosProps) => {
  return [
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `<!date^${Math.floor(
            periodDate.getTime() / 1000
          )}^{date} at {time}|${periodDate.toLocaleString()}> に終了\n<https://yamiichi.app/|闇市で簡単出品>`,
        },
      ],
    },
  ];
};

/**
 * 商品データを生成する Props
 */
interface generateOfferFieldsProps {
  item: OfferItemDataInterface;
}

/**
 * 商品データを生成する
 */
export const generateOfferFields = ({
  item: { title, description = '', authorId, lastBidderId = '', initialPrice, currentPrice, maxPrice },
}: generateOfferFieldsProps) => {
  const fields = [];

  fields.push(
    {
      type: 'mrkdwn',
      text: `商品名\n*${title}*`,
    },
    {
      type: 'mrkdwn',
      text: `出品者\n*<@${authorId}>*`,
    }
  );

  if (lastBidderId) {
    fields.push({
      type: 'mrkdwn',
      text: `最終入札者\n*<@${lastBidderId}>*`,
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
  item: OfferItemDataInterface;
}

/**
 * 入札アクションを生成する
 */
export const generateBidActions = ({ id, item: { title, initialPrice, currentPrice, maxPrice } }: generateBidActionsProps) => {
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
