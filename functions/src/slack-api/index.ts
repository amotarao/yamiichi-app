import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { env } from '../utils/env';
import { bidHandler } from './handlers/bid';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  res.send('<h1>Hello World! hogehoge</h1>');
});

app.use('/action', (req, res, next) => {
  const { payload } = req.body;
  const { token } = JSON.parse(payload);

  if (token !== env.slack_verification_token) {
    res.status(403).end();
    return;
  }

  next();
});

app.post('/action', async (req, res) => {
  const { payload } = req.body;
  const { team, user, trigger_id, message, actions } = JSON.parse(payload);
  console.log({ team, user, trigger_id, message, actions });

  if (!actions.length) {
    res.status(412).end();
    return;
  }

  const { action_id } = actions[0];

  const value = ((actions): string => {
    if ('value' in actions[0]) {
      return actions[0].value;
    }
    if ('selected_option' in actions[0]) {
      return actions[0].selected_option.value;
    }
    return '';
  })(actions);

  const valueMatches = value.match(/(.+)__(.+)/);

  if (valueMatches === null) {
    res.status(412).end();
    return;
  }

  const [, value1, value2] = valueMatches;
  console.log({ action_id, value, value1, value2 });

  switch (action_id) {
    case 'bid_button':
    case 'bid_select': {
      const result = await bidHandler({
        offerId: value1,
        teamId: team.id,
        userId: user.id,
        value: value2,
      });
      if (!result) {
        res.status(403).end();
        return;
      }
      res.status(200).end();
      return;
    }
  }

  res.status(412).end();
  return;
});

export default app;
