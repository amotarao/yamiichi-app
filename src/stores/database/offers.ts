import axios from 'axios';
import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { firestore } from '../../modules/firebase';

const offersCollection = firestore.collection('offers');
const teamsCollection = firestore.collection('teams');

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
  registrationDate: firebase.firestore.Timestamp;
  periodDate: firebase.firestore.Timestamp;
}

export interface OfferItemRegistrationInterface {
  title: string;
  description?: string;
  initialPrice: number;
  maxPrice?: number;
  periodDuration: number;
}

const useOffers = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<OfferItemInterface[]>([]);
  const [teamId, setTeamId] = useState<string>('');

  useEffect(() => {
    const tmpItems: OfferItemInterface[] = [];

    if (!teamId) {
      return;
    }

    offersCollection.where('teamRef', '==', teamsCollection.doc(teamId)).onSnapshot((snapshot) => {
      setLoading(false);

      snapshot.docChanges().forEach(({ type, doc }) => {
        const item = {
          id: doc.id,
          data: doc.data() as OfferItemDataInterface,
        };
        const index = tmpItems.findIndex((e) => e.id === item.id);

        switch (type) {
          case 'added':
            tmpItems.push(item);
            break;
          case 'modified':
            tmpItems.splice(index, 1, item);
            break;
          case 'removed':
            tmpItems.splice(index, 1);
            break;
          default:
            break;
        }
        setItems([...tmpItems]);
      });
    });
  }, [teamId]);

  const getById = (id: string) => {
    return items.find((item) => {
      return item.id === id;
    });
  };

  const create = (data: OfferItemRegistrationInterface, token: string) => {
    return axios.post('https://api.yamiichi.app/offer', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return {
    isLoading,
    items,
    setTeamId,
    getById,
    create,
  };
};

export const OffersContainer = createContainer(useOffers);
