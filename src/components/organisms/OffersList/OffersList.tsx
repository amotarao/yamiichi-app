/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { OfferItemInterface } from '../../../stores/database/offers';
import { OfferCardContainer } from '../OfferCard';
import { WrapperStyle } from './styled';

export interface OffersListProps {
  className?: string;
  items: OfferItemInterface[];
}

export const OffersList: React.FC<OffersListProps> = ({ className, items = [] }) => {
  return (
    <div className={className} css={WrapperStyle}>
      {items
        .sort((a, b) => a.data.periodDate.seconds - b.data.periodDate.seconds)
        .map((item) => (
          <OfferCardContainer key={item.id} item={item} />
        ))}
    </div>
  );
};
