import { firestore } from '../../modules/firebase';
import { OfferItemDataInterface } from '../../utils/interfaces';

const offersCollection = firestore.collection('offers');

interface bidHandlerProps {
  offerId: string;
  teamId: string;
  userId: string;
  value: string;
}

export const bidHandler = async (props: bidHandlerProps) => {
  const now = new Date();

  const offerId = props.offerId;
  const uid = `${props.teamId}-${props.userId}`;
  const price = Number(props.value);

  const offerDoc = offersCollection.doc(offerId);
  const { active, currentPrice, initialPrice, maxPrice, periodDate } = (await offerDoc.get()).data() as OfferItemDataInterface;

  const errors = [];

  if (!Number.isInteger(price)) {
    errors.push('hasError1');
  }
  if (!active) {
    errors.push('hasError2');
  }
  if (!(currentPrice < price)) {
    errors.push('hasError3');
  }
  if (!(initialPrice <= price)) {
    errors.push('hasError4');
  }
  if (!(maxPrice < 0 || maxPrice >= price)) {
    errors.push('hasError5');
  }
  if (!(periodDate.seconds * 1000 >= now.getTime())) {
    errors.push('hasError6');
  }

  console.log(errors);

  if (errors.length) {
    return false;
  }

  return offerDoc.collection('biders').add({
    price,
    tmp: {
      uid,
    },
  });
};
