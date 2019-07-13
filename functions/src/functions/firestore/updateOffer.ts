import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { OfferItemDataInterface, TeamItemDataInterface } from '../../utils/interfaces';
import { updateOffer, postBidOffer } from '../../utils/slack';

export default async ({ after, before }: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const afterData = after.data() as OfferItemDataInterface;
  const beforeData = before.data() as OfferItemDataInterface;

  const diff = _.omitBy(afterData, (value, key) => beforeData[key as keyof OfferItemDataInterface] === value);

  if ('currentPrice' in diff) {
    if (afterData.maxPrice >= 0 && afterData.maxPrice <= afterData.currentPrice) {
      await after.ref.set(
        {
          finished: true,
        },
        { merge: true }
      );

      const originalPost = await after.ref
        .collection('posts')
        .where('type', '==', 'createOffer')
        .where('service', '==', 'slack')
        .limit(1)
        .get();
      const {
        slack: { ts: originalTs },
      } = originalPost.docs[0].data();

      const team = await afterData.teamRef.get();
      const { slackBotAccessToken, slackDefaultChannel } = team.data() as TeamItemDataInterface;
      const client = new WebClient(slackBotAccessToken);

      const updateOfferPromise = updateOffer(client, {
        channel: slackDefaultChannel,
        ts: originalTs,
        id: after.id,
        finished: true,
        item: afterData,
      });

      const postBidOfferPromise = postBidOffer(client, {
        channel: slackDefaultChannel,
        thread_ts: originalTs,
        finished: true,
        item: afterData,
      });

      const [{ ok, channel = null, ts = null, ...postResult }] = await Promise.all([updateOfferPromise, postBidOfferPromise]);
      console.log({ ok, channel, ts, ...postResult });

      await after.ref.collection('posts').add({
        type: 'successBidOffer',
        service: 'slack',
        slack: {
          ok,
          channel,
          ts,
        },
      });

      return;
    } else {
      const originalPost = await after.ref
        .collection('posts')
        .where('type', '==', 'createOffer')
        .where('service', '==', 'slack')
        .limit(1)
        .get();
      const {
        slack: { ts: originalTs },
      } = originalPost.docs[0].data();

      const team = await afterData.teamRef.get();
      const { slackBotAccessToken, slackDefaultChannel } = team.data() as TeamItemDataInterface;
      const client = new WebClient(slackBotAccessToken);

      const updateOfferPromise = updateOffer(client, {
        channel: slackDefaultChannel,
        ts: originalTs,
        id: after.id,
        item: afterData,
      });

      const postBidOfferPromise = postBidOffer(client, {
        channel: slackDefaultChannel,
        thread_ts: originalTs,
        item: afterData,
      });

      const [{ ok, channel = null, ts = null, ...postResult }] = await Promise.all([updateOfferPromise, postBidOfferPromise]);
      console.log({ ok, channel, ts, ...postResult });

      await after.ref.collection('posts').add({
        type: 'updateOffer',
        service: 'slack',
        slack: {
          ok,
          channel,
          ts,
        },
      });

      return;
    }
  }

  return;
};
