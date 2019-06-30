import React from 'react';
import { OffersContainer } from '../../../stores/database/offers';
import { OfferCard, OfferCardProps } from './';

export const OfferCardContainer: React.FC<Partial<OfferCardProps>> = ({ item }) => {
  const { bid } = OffersContainer.useContainer();

  return (
    <OfferCard
      {...{
        item: item!,
        bid,
      }}
    />
  );
};
