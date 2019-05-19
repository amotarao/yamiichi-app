import React from 'react';
import { OffersContainer } from '../../../stores/database/offers';
import { OffersList, OffersListProps } from '.';

export const OffersListContainer: React.FC<Partial<OffersListProps>> = () => {
  const { items } = OffersContainer.useContainer();

  return (
    <OffersList
      {...{
        items,
      }}
    />
  );
};
