import * as functions from 'firebase-functions';
import apiApp from './api';
import createOffer from './firestore/createOffer';

export const api = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '1GB',
  })
  .https.onRequest(apiApp);

export const firestoreCreateOffer = functions.firestore.document('offers/{offerId}').onCreate(createOffer);
