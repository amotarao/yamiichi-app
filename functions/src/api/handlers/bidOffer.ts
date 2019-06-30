import * as moment from 'moment';
import { Request, Response } from 'express';
import { auth, firestore } from '../../modules/firebase';
import { OfferItemDataInterface } from '../../utils/interfaces';

const usersCollection = firestore.collection('users');
const offersCollection = firestore.collection('offers');

export interface BidOfferRequestParams {
  offerId: string;
}

export interface BidOfferRequestBody {
  price: number;
}

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

  const { offerId } = req.params as BidOfferRequestParams;
  const { price = 0 } = req.body as BidOfferRequestBody;
  console.log(req.body);

  if (isNaN(price)) {
    res.status(422).json({
      field: 'price',
      text: '正しい値ではない',
    });
    return;
  }

  const targetOfferRef = offersCollection.doc(offerId);
  const targetOfferSnapshot = await targetOfferRef.get();
  const { active, initialPrice, maxPrice, currentPrice } = targetOfferSnapshot.data() as OfferItemDataInterface;

  if (!active) {
    res.status(422).json({
      field: 'active',
      text: '出品が終了している',
    });
    return;
  }

  if (initialPrice > price) {
    res.status(422).json({
      field: 'initialPrice',
      text: '入札価格が出品価格を下回っている',
    });
    return;
  }

  if (maxPrice >= 0 && maxPrice < price) {
    res.status(422).json({
      field: 'initialPrice',
      text: '入札価格が上限価格を上回っている',
    });
    return;
  }

  if (currentPrice >= price) {
    res.status(422).json({
      field: 'currentPrice',
      text: '現在の価格を下回っている',
    });
    return;
  }

  const now = moment();

  await targetOfferRef.collection('biders').add({
    price,
    bidderRef: usersCollection.doc(uid),
    bidDate: now.toDate(),
  });

  res.status(200).json(req.body);
};
