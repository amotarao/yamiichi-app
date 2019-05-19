import React from 'react';
import { UserContainer } from '../../../stores/user';
import { AvatarButton, AvatarButtonProps } from './';

export const AvatarButtonContainer: React.FC<Partial<AvatarButtonProps>> = () => {
  const { signedIn, user, signOut } = UserContainer.useContainer();

  return (
    <AvatarButton
      {...{
        signedIn,
        user,
        signOut,
      }}
    />
  );
};
