import React from 'react';
import { LoadingCircle } from '../../atoms/LoadingCircle';

export interface CallbackProps {
  className?: string;
}

export const Callback: React.FC<CallbackProps> = () => {
  return <LoadingCircle isLoading />;
};
