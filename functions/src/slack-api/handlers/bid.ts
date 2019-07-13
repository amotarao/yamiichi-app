import { firestore } from '../../modules/firebase';
import { OfferItemDataInterface } from '../../utils/interfaces';

const offersCollection = firestore.collection('offers');
const usersCollection = firestore.collection('users');

interface bidHandlerProps {
  offerId: string;
  teamId: string;
  userId: string;
  value: string;
}

export const bidHandler = async (props: bidHandlerProps) => {
  const now = new Date();

  const offerId = props.offerId;
  const uid = `slack:${props.teamId}-${props.userId}`;
  const price = Number(props.value);

  const offerDoc = offersCollection.doc(offerId);
  const { active, finished, currentPrice, initialPrice, maxPrice, periodDate } = (await offerDoc.get()).data() as OfferItemDataInterface;

  const errors = [];

  if (!Number.isInteger(price)) {
    errors.push('hasError1');
  }
  if (!active) {
    errors.push('hasError2');
  }
  if (finished) {
    errors.push('hasError3');
  }
  if (!(currentPrice < price)) {
    errors.push('hasError4');
  }
  if (!(initialPrice <= price)) {
    errors.push('hasError5');
  }
  if (!(maxPrice < 0 || maxPrice >= price)) {
    errors.push('hasError6');
  }
  if (!(periodDate.seconds * 1000 >= now.getTime())) {
    errors.push('hasError7');
  }

  console.log(errors);

  if (errors.length) {
    return false;
  }

  const userRef = usersCollection.doc(uid);
  const userData = {
    slackAuthed: false,
  };
  const existsUser = (await userRef.get()).exists;
  if (!existsUser) {
    await userRef.set({ userData });
  }

  return offerDoc.collection('biders').add({
    price,
    tmp: {
      uid,
    },
  });
};
