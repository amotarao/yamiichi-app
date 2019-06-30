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

export interface OfferItemBiderItemDataInterface {
  bidDate: FirebaseFirestore.Timestamp;
  bidderRef: FirebaseFirestore.DocumentReference;
  price: number;
  rejected?: boolean;
}

export interface UserItemDataInterface {
  slackTeamRef: FirebaseFirestore.DocumentReference;
  slackUserId: string;
  slackAccessToken: string;
  slackScopes: string[];
}
