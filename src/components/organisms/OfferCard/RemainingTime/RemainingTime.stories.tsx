import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, date } from '@storybook/addon-knobs';
import { RemainingTime } from './RemainingTime';

const stories = storiesOf('organisms/OfferCard/RemainingTime', module);
stories.addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <RemainingTime
      {...{
        date: date('date', new Date('2020/01/23 12:34:56')),
      }}
    />
  );
});
