import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { firestore } from '../../modules/firebase';
import { UserItemDataInterface, OfferItemRegistrationInterface, TeamItemDataInterface } from '../../utils/interfaces';
import { postCreateOffer } from '../../utils/slack';

const usersCollection = firestore.collection('users');

export default async (snap: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {
  console.log(snap);
  const {
    tmp: { periodDuration, uid },
    ...item
  } = snap.data() as OfferItemRegistrationInterface;
  const { id } = snap;

  const author = await usersCollection.doc(uid).get();
  const { teamRef, slackUserId } = author.data() as UserItemDataInterface;

  const team = await teamRef.get();
  const { slackBotAccessToken, slackDefaultChannel } = team.data() as TeamItemDataInterface;

  const now = moment(context.timestamp);
  const registrationDate = now.toDate();
  const periodDate = now.add(periodDuration, 's').toDate();

  await snap.ref.set(
    {
      active: true,
      authorRef: usersCollection.doc(uid),
      lastBidderRef: null,
      teamRef,
      currentPrice: -1,
      registrationDate,
      periodDate,
      tmp: {},
    },
    { merge: true }
  );

  const client = new WebClient(slackBotAccessToken);
  const { ok, channel = null, ts = null, ...postResult } = await postCreateOffer(client, {
    channel: slackDefaultChannel,
    id,
    authorId: slackUserId,
    periodDate,
    item,
  });
  console.log({ ok, channel, ts, ...postResult });

  await snap.ref.collection('posts').add({
    type: 'createOffer',
    service: 'slack',
    slack: {
      ok,
      channel,
      ts,
    },
  });

  return;
};
