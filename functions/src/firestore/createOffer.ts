import { firestore } from '../modules/firebase';
import { OfferItemDataInterface, UserItemDataInterface } from '../utils/interfaces';

const usersCollection = firestore.collection('users');

export default async (snap: FirebaseFirestore.DocumentSnapshot) => {
  const { authorRef } = snap.data() as OfferItemDataInterface;
  const author = await usersCollection.doc(authorRef.id).get();
  const { slackTeamRef } = author.data() as UserItemDataInterface;

  return snap.ref.set(
    {
      teamRef: slackTeamRef,
    },
    { merge: true }
  );
};
