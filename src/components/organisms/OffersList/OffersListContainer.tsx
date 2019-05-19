import React from 'react';
import { Subscribe } from 'unstated';
import { OffersContainer } from '../../../stores/database/offers';
import { OffersList, OffersListProps } from '.';

export const OffersListContainer: React.FC<Partial<OffersListProps>> = () => {
  return (
    <Subscribe to={[OffersContainer]}>
      {(offers: OffersContainer) => {
        const newProps: OffersListProps = {
          items: offers.state.items,
        };
        return <OffersList {...newProps} />;
      }}
    </Subscribe>
  );
};
