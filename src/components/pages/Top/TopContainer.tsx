import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Subscribe } from 'unstated';
import { UserContainer } from '../../../stores/user';
import { Top, TopProps } from './';

interface Props extends RouteComponentProps, Partial<TopProps> {}

const TopContainer: React.FC<Props> = ({ history, ...props }) => {
  return (
    <Subscribe to={[UserContainer]}>
      {(user: UserContainer) => {
        if (!user.state.isLoading && user.state.signedIn) {
          history.replace('/dashboard');
        }
        return <Top {...props} {...user.state} {...user} />;
      }}
    </Subscribe>
  );
};

const TopContainerWithRouter = withRouter(TopContainer);

export { TopContainerWithRouter as TopContainer };
