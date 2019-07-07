import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { firestore } from '../modules/firebase';
import { UserItemDataInterface, OfferItemRegistrationInterface } from '../utils/interfaces';

const usersCollection = firestore.collection('users');

export default async (snap: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {
  console.log(snap);
  const {
    tmp: { periodDuration, uid },
  } = snap.data() as OfferItemRegistrationInterface;

  const author = await usersCollection.doc(uid).get();
  const { teamRef } = author.data() as UserItemDataInterface;

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

  return;
};
