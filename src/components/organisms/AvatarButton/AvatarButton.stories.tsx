import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { AvatarButton, AvatarButtonProps } from './AvatarButton';

const stories = storiesOf('organisms', module).addDecorator(withKnobs);

stories.add('AvatarButton', () => {
  const props: AvatarButtonProps = {
    signedIn: boolean('signedIn', false),
    user: {
      displayName: 'あいうえお',
      email: 'hoge@example.com',
      photoURL: 'https://pbs.twimg.com/profile_images/991207907441102848/i-xgv1sZ_bigger.jpg',
      uid: 'hogehogehoge',
    },
    signOut: action('signOut'),
  };

  return <AvatarButton {...props} />;
});
