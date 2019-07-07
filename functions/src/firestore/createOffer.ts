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
  const now = moment(context.timestamp);

  const author = await usersCollection.doc(uid).get();
  const { teamRef } = author.data() as UserItemDataInterface;

  return snap.ref.set(
    {
      active: true,
      authorRef: usersCollection.doc(uid),
      lastBidderRef: null,
      teamRef,
      currentPrice: -1,
      registrationDate: now.toDate(),
      periodDate: now.add(periodDuration, 's').toDate(),
      tmp: {},
    },
    { merge: true }
  );
};
