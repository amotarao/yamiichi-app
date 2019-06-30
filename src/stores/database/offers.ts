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
  active: boolean;
  authorRef: firebase.firestore.DocumentReference;
  lastBidderRef: firebase.firestore.DocumentReference | null;
  initialPrice: number;
  maxPrice: number;
  currentPrice: number;
  registrationDate: firebase.firestore.Timestamp;
  periodDate: firebase.firestore.Timestamp;
}

export interface OfferItemRegistrationInterface {
  title: OfferItemDataInterface['title'];
  description?: OfferItemDataInterface['description'];
  initialPrice: OfferItemDataInterface['initialPrice'];
  maxPrice?: OfferItemDataInterface['maxPrice'];
  periodDuration: number;
}

export interface OfferItemBiderInterface {
  id: OfferItemInterface['id'];
  price: number;
}

const useOffers = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<OfferItemInterface[]>([]);
  const [teamId, setTeamId] = useState<string>('');
  const [uid, setUid] = useState<string | null>(null);

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

  const create = async ({ title, description = '', initialPrice, maxPrice = -1, periodDuration }: OfferItemRegistrationInterface) => {
    const result = await offersCollection.add({
      title,
      description,
      initialPrice,
      maxPrice,
      tmp: {
        uid,
        periodDuration,
      },
    });
    return result;
  };

  const bid = (data: OfferItemBiderInterface, token: string) => {
    return axios.post(`https://api.yamiichi.app/bid/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return {
    isLoading,
    items,
    setTeamId,
    setUid,
    getById,
    create,
    bid,
  };
};

export const OffersContainer = createContainer(useOffers);
