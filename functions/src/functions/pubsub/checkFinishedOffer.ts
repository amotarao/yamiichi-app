import * as functions from 'firebase-functions';
import { checkFinishedOffer } from '../../modules/firestore/checkFinishedOffer';

export default async (context: functions.EventContext) => {
  console.log(context);
  await checkFinishedOffer();
  return;
};
