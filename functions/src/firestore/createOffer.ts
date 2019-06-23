import { firestore } from '../modules/firebase';

const usersCollection = firestore.collection('users');

export default async (snap: FirebaseFirestore.DocumentSnapshot) => {
  const { authorRef } = snap.data() as { authorRef: FirebaseFirestore.DocumentReference };
  const author = await usersCollection.doc(authorRef.id).get();
  const { slackTeamRef } = author.data() as { slackTeamRef: FirebaseFirestore.DocumentReference };

  return snap.ref.set(
    {
      teamRef: slackTeamRef,
    },
    { merge: true }
  );
};
