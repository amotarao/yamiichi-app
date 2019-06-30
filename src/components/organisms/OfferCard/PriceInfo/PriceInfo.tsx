/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { PriceInfoStyle, CurrentPriceStyle, MaxPriceStyle } from './styled';

export interface PriceInfoProps {
  initialPrice: number;
  maxPrice: number;
  currentPrice: number;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({ initialPrice, maxPrice, currentPrice }) => {
  const hasMaxPrice = maxPrice >= 0;
  return (
    <div css={PriceInfoStyle}>
      {hasMaxPrice && maxPrice !== initialPrice ? <p css={MaxPriceStyle}>即決 ¥{maxPrice.toLocaleString()}</p> : null}
      <p css={CurrentPriceStyle}>
        <span>{maxPrice !== initialPrice ? '現在 ' : '即決 '}</span>¥{currentPrice !== -1 ? currentPrice.toLocaleString() : initialPrice.toLocaleString()}
      </p>
    </div>
  );
};
