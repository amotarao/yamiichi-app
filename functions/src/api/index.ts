import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import authRedirectHandler from './handlers/authRedirect';
import bidOfferHandler from './handlers/bidOffer';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  res.send('<h1>Hello World! hogehoge</h1>');
});
app.get('/auth/redirect', authRedirectHandler);
app.post('/bid/:offerId([a-zA-Z0-9]+)', bidOfferHandler);

export default app;
