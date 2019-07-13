import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { OfferItemDataInterface, TeamItemDataInterface } from '../utils/interfaces';
import { updateOffer, postBidOffer } from '../utils/slack';

export default async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const afterData = change.after.data() as OfferItemDataInterface;
  const beforeData = change.before.data() as OfferItemDataInterface;

  const diff = _.omitBy(afterData, (value, key) => beforeData[key as keyof OfferItemDataInterface] === value);

  if ('currentPrice' in diff) {
    if (afterData.maxPrice >= 0 && afterData.maxPrice <= afterData.currentPrice) {
      await change.after.ref.set(
        {
          active: false,
        },
        { merge: true }
      );
      return;
    } else {
      const originalPost = await change.after.ref
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
        id: change.after.id,
        item: afterData,
      });

      const postBidOfferPromise = postBidOffer(client, {
        channel: slackDefaultChannel,
        thread_ts: originalTs,
        item: afterData,
      });

      const [{ ok, channel = null, ts = null, ...postResult }] = await Promise.all([updateOfferPromise, postBidOfferPromise]);
      console.log({ ok, channel, ts, ...postResult });

      await change.after.ref.collection('posts').add({
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
