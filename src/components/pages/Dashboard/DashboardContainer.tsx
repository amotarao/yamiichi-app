import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Subscribe } from 'unstated';
import { UserContainer } from '../../../stores/user';
import { OffersContainer } from '../../../stores/database/offers';
import { Dashboard, DashboardProps } from './';

interface Props extends RouteComponentProps, Partial<DashboardProps> {}

const DashboardContainer: React.FC<Props> = ({ history, ...props }) => {
  return (
    <Subscribe to={[UserContainer, OffersContainer]}>
      {(user: UserContainer, offers: OffersContainer) => {
        if (!user.state.isLoading && !user.state.signedIn) {
          history.replace('/');
        }
        const isLoading = user.state.isLoading || offers.state.isLoading;
        return <Dashboard {...props} isLoading={isLoading} />;
      }}
    </Subscribe>
  );
};

const DashboardContainerWithRouter = withRouter(DashboardContainer);

export { DashboardContainerWithRouter as DashboardContainer };
