/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { PriceInfoStyle, CurrentPriceStyle, MaxPriceStyle } from './styled';

export interface PriceInfoProps {
  initialPrice: number;
  hasMaxPrice: boolean;
  maxPrice: number;
  currentPrice: number;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({ initialPrice, hasMaxPrice, maxPrice, currentPrice }) => {
  return (
    <div css={PriceInfoStyle}>
      {hasMaxPrice && maxPrice !== initialPrice ? <p css={MaxPriceStyle}>即決 ¥{maxPrice.toLocaleString()}</p> : null}
      <p css={CurrentPriceStyle}>
        <span>{maxPrice !== initialPrice ? '現在 ' : '即決 '}</span>¥{currentPrice ? currentPrice.toLocaleString() : initialPrice.toLocaleString()}
      </p>
    </div>
  );
};
