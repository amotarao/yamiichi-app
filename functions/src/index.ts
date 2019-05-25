import * as functions from 'firebase-functions';
import apiApp from './api';

export const api = functions.https.onRequest(apiApp);
