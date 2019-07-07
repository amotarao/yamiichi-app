import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { UserContainer } from '../../../stores/user';
import { OffersContainer } from '../../../stores/database/offers';
import { PublicUsersContainer } from '../../../stores/database/publicUsers';
import { Dashboard, DashboardProps } from './';

interface Props extends RouteComponentProps, Partial<DashboardProps> {}

const DashboardInner: React.FC<Props> = ({ history }) => {
  const { isLoading: userIsLoading, signedIn, user } = UserContainer.useContainer();
  const { isLoading: offersIsLoading, setTeamId: offerSetTeamId, setUid } = OffersContainer.useContainer();
  const { setTeamId: publicUsersSetTeamId } = PublicUsersContainer.useContainer();

  useEffect(() => {
    if (!userIsLoading && !signedIn) {
      history.replace('/');
    }
  }, [history, signedIn, userIsLoading]);

  const isLoading = userIsLoading || offersIsLoading;

  if (user) {
    offerSetTeamId(user.uid.replace(/-.+$/, ''));
    publicUsersSetTeamId(user.uid.replace(/-.+$/, ''));
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
      <PublicUsersContainer.Provider>
        <DashboardInner {...props} />
      </PublicUsersContainer.Provider>
    </OffersContainer.Provider>
  );
};

const DashboardContainerWithRouter = withRouter(DashboardContainer);

export { DashboardContainerWithRouter as DashboardContainer };
