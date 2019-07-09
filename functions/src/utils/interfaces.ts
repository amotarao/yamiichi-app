export interface OfferItemDataInterface {
  title: string;
  description?: string;
  active: boolean;
  authorRef: FirebaseFirestore.DocumentReference;
  lastBidderRef: FirebaseFirestore.DocumentReference | null;
  initialPrice: number;
  maxPrice: number;
  currentPrice: number;
  registrationDate: FirebaseFirestore.Timestamp;
  periodDate: FirebaseFirestore.Timestamp;
}

export interface OfferItemRegistrationInterface {
  title: OfferItemDataInterface['title'];
  description: OfferItemDataInterface['description'];
  initialPrice: OfferItemDataInterface['initialPrice'];
  maxPrice: OfferItemDataInterface['maxPrice'];
  tmp: {
    periodDuration: number;
    uid: string;
  };
}

export interface OfferItemBiderItemDataInterface {
  bidDate: FirebaseFirestore.Timestamp;
  bidderRef: FirebaseFirestore.DocumentReference;
  price: number;
}

export interface OfferItemBiderRegistrationInterface {
  price: OfferItemBiderItemDataInterface['price'];
  tmp: {
    uid: string;
  };
}

export interface UserItemDataInterface {
  teamRef: FirebaseFirestore.DocumentReference;
  slackUserId: string;
  slackAccessToken: string;
  slackScopes: string[];
}

export interface TeamItemDataInterface {
  slackBotAccessToken: string;
  slackBotUserId: string;
  slackDefaultChannel: string;
  slackTeamId: string;
  slackTeamName: string;
}
