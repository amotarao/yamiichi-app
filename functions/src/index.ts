import * as functions from 'firebase-functions';
import apiApp from './api';
import slackApiApp from './slack-api';
import createOffer from './functions/firestore/createOffer';
import updateOffer from './functions/firestore/updateOffer';
import createOfferBider from './functions/firestore/createOfferBider';

export const api = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '256MB',
  })
  .https.onRequest(apiApp);

export const slackApi = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '1GB',
  })
  .https.onRequest(slackApiApp);

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
