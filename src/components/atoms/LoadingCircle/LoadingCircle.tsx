/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { CircularProgress } from '@material-ui/core';
import { ProgressWrapperStyle } from './styled';

export interface LoadingCircleProps {
  className?: string;
  isLoading: boolean;
}

export const LoadingCircle: React.FC<LoadingCircleProps> = ({ className, isLoading }) => (
  <CSSTransition classNames="is-loading" in={isLoading} timeout={700} unmountOnExit>
    <div className={className} css={ProgressWrapperStyle}>
      <CircularProgress />
    </div>
  </CSSTransition>
);
