import { firestore } from '../../modules/firebase';
import { checkFinishedOffer } from '../../modules/firestore/checkFinishedOffer';
import { OfferItemDataInterface } from '../../utils/interfaces';

const offersCollection = firestore.collection('offers');
const usersCollection = firestore.collection('users');

interface bidHandlerProps {
  offerId: string;
  teamId: string;
  userId: string;
  value: string;
}

export const bidHandler = async (props: bidHandlerProps): Promise<{ error: boolean; result: FirebaseFirestore.DocumentReference | string }> => {
  const now = new Date();

  const offerId = props.offerId;
  const uid = `slack:${props.teamId}-${props.userId}`;
  const price = Number(props.value);

  const offerDoc = offersCollection.doc(offerId);
  const { active, finished, currentPrice, initialPrice, maxPrice, periodDate } = (await offerDoc.get()).data() as OfferItemDataInterface;

  const errors = [];

  if (!Number.isInteger(price)) {
    errors.push('入札金額が整数ではない');
  }
  if (!active) {
    errors.push('出品が公開されていない');
  }
  if (finished) {
    errors.push('出品が終了している');
  }
  if (!(currentPrice < price)) {
    errors.push('入札金額が現在の価格を下回っている');
  }
  if (!(initialPrice <= price)) {
    errors.push('入札金額が出品価格を下回っている');
  }
  if (!(maxPrice < 0 || maxPrice >= price)) {
    errors.push('入札金額が落札価格を上回っている');
  }
  if (!(periodDate.seconds * 1000 >= now.getTime())) {
    errors.push('出品が終了している');
  }

  if (errors.length) {
    console.log(errors);
    await checkFinishedOffer();
    return {
      error: true,
      result: errors.join('\n'),
    };
  }

  const userRef = usersCollection.doc(uid);
  const userData = {
    slackAuthed: false,
  };
  const existsUser = (await userRef.get()).exists;
  if (!existsUser) {
    await userRef.set({ userData });
  }

  const result = await offerDoc.collection('biders').add({
    price,
    tmp: {
      uid,
    },
  });

  return {
    error: false,
    result,
  };
};
