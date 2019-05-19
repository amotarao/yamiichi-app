import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { PriceInfo } from './PriceInfo';

const stories = storiesOf('organisms/OfferCard/PriceInfo', module);
stories.addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <PriceInfo
      {...{
        initialPrice: number('initialPrice', 100),
        hasMaxPrice: boolean('hasMaxPrice', true),
        maxPrice: number('maxPrice', 100),
        currentPrice: number('currentPrice', 100),
      }}
    />
  );
});

stories.add('has max price', () => {
  return (
    <PriceInfo
      {...{
        initialPrice: 0,
        hasMaxPrice: true,
        maxPrice: 100,
        currentPrice: 50,
      }}
    />
  );
});

stories.add('has max price, same max, current', () => {
  return (
    <PriceInfo
      {...{
        initialPrice: 100,
        hasMaxPrice: true,
        maxPrice: 100,
        currentPrice: 100,
      }}
    />
  );
});

stories.add('has not max price', () => {
  return (
    <PriceInfo
      {...{
        initialPrice: 0,
        hasMaxPrice: false,
        maxPrice: -1,
        currentPrice: 0,
      }}
    />
  );
});
