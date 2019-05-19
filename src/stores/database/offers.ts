import axios from 'axios';
import { Container } from 'unstated';
import { firestore } from '../../modules/firebase';

const offersCollection = firestore.collection('offers');

export interface OffersState {
  isLoading: boolean;
  items: OfferItemInterface[];
}

export interface OfferItemInterface {
  id: string;
  data: OfferItemDataInterface;
}

export interface OfferItemDataInterface {
  title: string;
  description?: string;
  itemImageUrl?: string;
  active: boolean;
  authorRef: firebase.firestore.DocumentReference;
  lastBidderRef: firebase.firestore.DocumentReference;
  initialPrice: number;
  hasMaxPrice: boolean;
  maxPrice: number;
  currentPrice: number;
  registrationDate: Date;
  periodDate: Date;
}

export interface OfferItemRegistrationInterface {
  title: string;
  description?: string;
  initialPrice: number;
  maxPrice?: number;
  periodDuration: number;
}

export class OffersContainer extends Container<OffersState> {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      items: [],
    };
    this.onSnapshot();
  }

  onSnapshot = () => {
    const items: OfferItemInterface[] = [];

    offersCollection.where('teamRef', '==', firestore.collection('teams').doc('slack:T07GUTWR2')).onSnapshot(
      async (snapshot) => {
        await this.setState({
          ...this.state,
          isLoading: false,
        });

        snapshot.docChanges().forEach(({ type, doc }) => {
          const item = {
            id: doc.id,
            data: doc.data() as OfferItemDataInterface,
          };
          const index = items.findIndex((e) => e.id === item.id);

          switch (type) {
            case 'added':
              items.push(item);
              break;
            case 'modified':
              items.splice(index, 1, item);
              break;
            case 'removed':
              items.splice(index, 1);
              break;
            default:
              break;
          }

          this.setState({
            ...this.state,
            items,
          });
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  getById = (id: string) => {
    return this.state.items.find((item) => {
      return item.id === id;
    });
  };

  create = (data: OfferItemRegistrationInterface, token: string) => {
    return axios.post('https://api.yamiichi.app/offer', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
