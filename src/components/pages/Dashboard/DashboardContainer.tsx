import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { UserContainer } from '../../../stores/user';
import { OffersContainer } from '../../../stores/database/offers';
import { Dashboard, DashboardProps } from './';

interface Props extends RouteComponentProps, Partial<DashboardProps> {}

const DashboardInner: React.FC<Props> = ({ history }) => {
  const { isLoading: userIsLoading, signedIn, user } = UserContainer.useContainer();
  const { isLoading: offersIsLoading, setTeamId, setUid } = OffersContainer.useContainer();

  useEffect(() => {
    if (!userIsLoading && !signedIn) {
      history.replace('/');
    }
  }, [history, signedIn, userIsLoading]);

  const isLoading = userIsLoading || offersIsLoading;

  if (user) {
    setTeamId(user.uid.replace(/-.+$/, ''));
    setUid(user.uid);
  }

  return (
    <Dashboard
      {...{
        isLoading,
      }}
    />
  );
};

const DashboardContainer: React.FC<Props> = (props) => {
  return (
    <OffersContainer.Provider>
      <DashboardInner {...props} />
    </OffersContainer.Provider>
  );
};

const DashboardContainerWithRouter = withRouter(DashboardContainer);

export { DashboardContainerWithRouter as DashboardContainer };
