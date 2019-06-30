export default async (snap: FirebaseFirestore.DocumentSnapshot) => {
  const { price, bidderRef, bidDate } = snap.data() as { price: number; bidderRef: FirebaseFirestore.DocumentReference; bidDate: FirebaseFirestore.Timestamp };
  const offerRef = snap.ref.parent.parent!;
  const offerSnapshot = await offerRef.get();
  const { active, currentPrice, periodDate } = offerSnapshot.data() as { active: boolean; currentPrice: number; periodDate: FirebaseFirestore.Timestamp };

  const reject = () => {
    return snap.ref.set(
      {
        rejected: true,
      },
      { merge: true }
    );
  };

  if (!active) {
    return reject();
  }
  if (periodDate.seconds < bidDate.seconds) {
    return reject();
  }
  if (currentPrice >= price) {
    return reject();
  }

  await offerRef.set(
    {
      currentPrice: price,
      lastBidderRef: bidderRef,
    },
    { merge: true }
  );

  return snap.ref.set(
    {
      rejected: false,
    },
    { merge: true }
  );
};
