import React from 'react';
import { Subscribe } from 'unstated';
import { UserContainer } from '../../../stores/user';
import { AvatarButton, AvatarButtonProps } from './';

export const AvatarButtonContainer: React.FC<Partial<AvatarButtonProps>> = () => {
  return <Subscribe to={[UserContainer]}>{(user: UserContainer) => <AvatarButton {...user.state} {...user} />}</Subscribe>;
};
