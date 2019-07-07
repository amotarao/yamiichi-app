import React from 'react';
import { OffersContainer } from '../../../stores/database/offers';
import { PublicUsersContainer } from '../../../stores/database/publicUsers';
import { OfferCard, OfferCardProps } from './';

export const OfferCardContainer: React.FC<Partial<OfferCardProps>> = ({ item }) => {
  const { bid } = OffersContainer.useContainer();
  const { getPublicUserById: getUserById } = PublicUsersContainer.useContainer();

  return (
    <OfferCard
      {...{
        item: item!,
        bid,
        getUserById,
      }}
    />
  );
};
