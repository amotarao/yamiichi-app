import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { firestore } from '../../modules/firebase';

const publicUsersCollection = firestore.collection('publicUsers');
const teamsCollection = firestore.collection('teams');

export interface PublicUserItemInterface {
  id: string;
  data: PublicUserItemDataInterface;
}

export interface PublicUserItemDataInterface {
  displayName?: string;
  photoURL?: string;
}

const usePublicUsers = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<PublicUserItemInterface[]>([]);
  const [teamId, setTeamId] = useState<string>('');

  useEffect(() => {
    const tmpItems: PublicUserItemInterface[] = [];

    if (!teamId) {
      return;
    }

    publicUsersCollection.where('teamRef', '==', teamsCollection.doc(teamId)).onSnapshot((snapshot) => {
      setLoading(false);

      snapshot.docChanges().forEach(({ type, doc }) => {
        const item = {
          id: doc.id,
          data: doc.data() as PublicUserItemDataInterface,
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

  return {
    isLoading,
    items,
    setTeamId,
    getById,
  };
};

export const PublicUsersContainer = createContainer(usePublicUsers);
