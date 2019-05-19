import React, { useEffect, useCallback } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { parse } from 'query-string';
import { UserContainer } from '../../../stores/user';
import { Callback, CallbackProps } from './';

interface Props extends RouteComponentProps, Partial<CallbackProps> {}

const CallbackContainer: React.FC<Props> = ({ location, history }) => {
  const { signedIn, signIn } = UserContainer.useContainer();

  const toTop = useCallback(() => history.replace('/'), [history]);
  const toDashboard = useCallback(() => history.replace('/dashboard'), [history]);
  if (signedIn) {
    toDashboard();
  }
  if (!location || !location.search) {
    toTop();
  }

  const { token } = parse(location.search) as { token: string };
  useEffect(() => {
    signIn(token)
      .then(() => {
        toDashboard();
      })
      .catch(() => {
        toTop();
      });
  }, [token, signIn, toTop, toDashboard]);

  return <Callback />;
};

const CallbackContainerWithRouter = withRouter(CallbackContainer);

export { CallbackContainerWithRouter as CallbackContainer };
