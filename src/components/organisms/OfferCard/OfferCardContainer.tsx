import React from 'react';
import { UserContainer } from '../../../stores/user';
import { OffersContainer } from '../../../stores/database/offers';
import { OfferCard, OfferCardProps } from './';

export const OfferCardContainer: React.FC<Partial<OfferCardProps>> = ({ item }) => {
  const { user } = UserContainer.useContainer();
  const { bid } = OffersContainer.useContainer();

  return (
    <OfferCard
      {...{
        item: item!,
        user: user!,
        bid,
      }}
    />
  );
};
