/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Countdown from 'react-countdown-now';
import { RemainingTimeStyle } from './styled';

export interface RemainingTimeProps {
  date: Date;
}

export const RemainingTime: React.FC<RemainingTimeProps> = ({ date }) => {
  return (
    <p css={RemainingTimeStyle}>
      <Countdown date={date} daysInHours />
    </p>
  );
};
