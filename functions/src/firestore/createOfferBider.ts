import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { firestore } from '../modules/firebase';
import { OfferItemBiderRegistrationInterface } from '../utils/interfaces';

const usersCollection = firestore.collection('users');

export default async (snap: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) => {
  console.log(snap);
  const {
    price,
    tmp: { uid },
  } = snap.data() as OfferItemBiderRegistrationInterface;
  const now = moment(context.timestamp);
  const userRef = usersCollection.doc(uid);

  await snap.ref.parent.parent!.set(
    {
      currentPrice: price,
      lastBidderRef: userRef,
    },
    { merge: true }
  );

  return snap.ref.set(
    {
      bidDate: now.toDate(),
      bidderRef: userRef,
    },
    { merge: true }
  );
};
