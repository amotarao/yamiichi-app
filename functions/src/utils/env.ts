import * as functions from 'firebase-functions';

export const env = functions.config().app as {
  auth_redirect_url: string;
  slack_client_id: string;
  slack_client_secret: string;
  slack_verification_token: string;
};
