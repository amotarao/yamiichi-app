/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { OfferItemInterface } from '../../../stores/database/offers';
import { OfferCard } from '../OfferCard';
import { WrapperStyle } from './styled';

export interface OffersListProps {
  className?: string;
  items: OfferItemInterface[];
}

export const OffersList: React.FC<OffersListProps> = ({ className, items = [] }) => {
  return (
    <div className={className} css={WrapperStyle}>
      {items.map((item) => (
        <OfferCard key={item.id} {...item} />
      ))}
    </div>
  );
};
