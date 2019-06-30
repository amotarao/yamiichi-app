import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { OfferItemDataInterface } from '../utils/interfaces';

export default async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const afterData = change.after.data() as OfferItemDataInterface;
  const beforeData = change.before.data() as OfferItemDataInterface;

  const diff = _.omitBy(afterData, (value, key) => beforeData[key as keyof OfferItemDataInterface] === value);

  if ('currentPrice' in diff) {
    if (afterData.maxPrice >= 0 && afterData.maxPrice <= afterData.currentPrice) {
      return change.after.ref.set(
        {
          active: false,
        },
        { merge: true }
      );
    }
  }

  return null;
};
