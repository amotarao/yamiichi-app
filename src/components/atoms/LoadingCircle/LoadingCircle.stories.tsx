import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { LoadingCircle, LoadingCircleProps } from './LoadingCircle';

const stories = storiesOf('atoms', module);
stories.addDecorator(withKnobs);

stories.add('LoadingCircle', () => {
  const props: LoadingCircleProps = {
    isLoading: boolean('isLoading', true),
  };

  return <LoadingCircle {...props} />;
});
