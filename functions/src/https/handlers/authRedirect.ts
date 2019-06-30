import { WebClient } from '@slack/web-api';
import { Request, Response } from 'express';
import { FirebaseError } from 'firebase-admin';
import { env } from '../../modules/env';
import { auth, firestore } from '../../modules/firebase';

const usersCollection = firestore.collection('users');
const teamsCollection = firestore.collection('teams');

export interface AuthRedirectQuery {
  code?: string;
}

export default async (req: Request, res: Response) => {
  const { code } = req.query as AuthRedirectQuery;
  if (!code) {
    res.status(400).end();
    return;
  }

  const ClientWithoutToken = new WebClient();
  const result = await ClientWithoutToken.oauth.access({
    client_id: env.slack_client_id!,
    client_secret: env.slack_client_secret!,
    code,
  });
  console.log(result);

  const { ok, access_token, scope, user_id, team_name, team_id, bot } = result as {
    ok: boolean;
    access_token: string;
    scope: string;
    user_id: string;
    team_name: string;
    team_id: string;
    bot: {
      bot_access_token: string;
      bot_user_id: string;
    };
  };
  if (!ok) {
    res.status(403).end();
    return;
  }

  const teamDoc = teamsCollection.doc(`slack:${team_id}`);
  const teamData = {
    slackBotAccessToken: bot.bot_access_token,
    slackBotUserId: bot.bot_user_id,
    slackTeamId: team_id,
    slackTeamName: team_name,
  };
  teamDoc.set(teamData, { merge: true });

  const uid = `slack:${team_id}-${user_id}`;
  const userDoc = usersCollection.doc(uid);
  const userData = {
    slackAccessToken: access_token,
    slackScopes: scope.split(','),
    slackUserId: user_id,
    slackTeamRef: teamDoc,
  };
  userDoc.set(userData, { merge: true });

  const Client = new WebClient(access_token as string);
  const { display_name, image_192 } = ((await Client.users.profile.get()) as {
    profile?: {
      display_name: string;
      image_192: string;
    };
  }).profile!;

  await auth
    .updateUser(uid, {
      displayName: display_name,
      photoURL: image_192,
    })
    .catch(async (error: FirebaseError) => {
      if (error.code === 'auth/user-not-found') {
        return await auth.createUser({
          uid,
          displayName: display_name,
          photoURL: image_192,
        });
      }
      return await Promise.reject();
    });
  const token = await auth.createCustomToken(uid);

  res.redirect(302, `${env.auth_redirect_url!}?token=${token}`);
};
