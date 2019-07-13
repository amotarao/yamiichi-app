import { firestore } from '../firebase';

export const checkFinishedOffer = async () => {
  const now = new Date();
  const snapshot = await firestore
    .collection('offers')
    .where('periodDate', '>=', now)
    .where('active', '==', true)
    .where('finished', '==', false)
    .get();

  const requests = snapshot.docs.map((doc) => {
    return doc.ref.set(
      {
        finished: true,
      },
      { merge: true }
    );
  });
  await Promise.all(requests);
  return;
};
