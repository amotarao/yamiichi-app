import * as functions from 'firebase-functions';
import httpsApi from './https';
import createOffer from './firestore/createOffer';
import updateOffer from './firestore/updateOffer';
import createOfferBider from './firestore/createOfferBider';

export const api = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '1GB',
  })
  .https.onRequest(httpsApi);

export const firestoreCreateOffer = functions
  .region('asia-northeast1')
  .firestore.document('offers/{offerId}')
  .onCreate(createOffer);
export const firestoreUpdateOffer = functions
  .region('asia-northeast1')
  .firestore.document('offers/{offerId}')
  .onUpdate(updateOffer);
export const firestoreCreateOfferBider = functions
  .region('asia-northeast1')
  .firestore.document('offers/{offerId}/biders/{biderId}')
  .onCreate(createOfferBider);
