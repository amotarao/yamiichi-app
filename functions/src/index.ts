import * as functions from 'firebase-functions';
import apiApp from './api';

export const api = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '1GB',
  })
  .https.onRequest(apiApp);
