import * as moment from 'moment';
import { Request, Response } from 'express';
import { auth, firestore } from '../../modules/firebase';

const usersCollection = firestore.collection('users');
const offersCollection = firestore.collection('offers');

export default async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.split(' ') || authorization.split(' ')[0] !== 'Bearer') {
    res.status(403).send('<h1>403 Forbidden</h1>');
    return;
  }

  const token = authorization.split(' ')[1];
  const { uid } = await auth.verifyIdToken(token).catch();
  if (!uid) {
    res.status(403).send('<h1>403 Forbidden</h1>');
    return;
  }

  const { title = '', description = '', initialPrice = -1, maxPrice = -1, periodDuration = -1 } = req.body;
  console.log(req.body);

  const errors = [];

  if (!title) {
    errors.push({
      field: 'title',
      text: 'タイトルが未入力',
    });
  }
  if (isNaN(Number(initialPrice))) {
    errors.push({
      field: 'initialPrice',
      text: '出品価格が数値ではない',
    });
  }
  if (initialPrice < 0) {
    errors.push({
      field: 'initialPrice',
      text: '出品価格が正しい値ではない',
    });
  }
  if (isNaN(Number(maxPrice))) {
    errors.push({
      field: 'maxPrice',
      text: '即決価格が数値ではない',
    });
  }
  if (maxPrice >= 0 && !isNaN(Number(maxPrice)) && initialPrice >= 0 && !isNaN(Number(initialPrice)) && maxPrice < initialPrice) {
    errors.push({
      field: 'maxPrice',
      text: '即決価格が出品価格未満',
    });
  }
  if (periodDuration < 0) {
    errors.push({
      field: 'periodDuration',
      text: '出品期間が正しい値ではない',
    });
  }

  if (errors.length) {
    res.status(422).json({ errors });
  }

  const now = moment();

  const { slackTeamRef } = (await usersCollection.doc(uid).get()).data() as { slackTeamRef: FirebaseFirestore.DocumentReference };

  await offersCollection.add({
    title,
    description: description || '',
    itemImageUrl: '',
    active: true,
    authorRef: usersCollection.doc(uid),
    lastBidderRef: null,
    teamRef: slackTeamRef,
    initialPrice,
    hasMaxPrice: maxPrice >= 0,
    maxPrice: maxPrice >= 0 ? maxPrice : -1,
    currentPrice: initialPrice,
    registrationDate: now.toDate(),
    periodDate: now.add(periodDuration, 's').toDate(),
  });

  res.status(200).json(req.body);
};
