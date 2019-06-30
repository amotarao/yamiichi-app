import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { UserContainer } from '../../../stores/user';
import { OffersContainer } from '../../../stores/database/offers';
import { Create, CreateProps } from './';

interface Props extends RouteComponentProps, Partial<CreateProps> {}

const CreateInner: React.FC<Props> = ({ history }) => {
  const { isLoading: userIsLoading, signedIn, user } = UserContainer.useContainer();
  const { isLoading: offersIsLoading, setTeamId, setUid, create } = OffersContainer.useContainer();

  if (!userIsLoading && !signedIn) {
    history.replace('/');
  }

  const isLoading = userIsLoading || offersIsLoading;

  const toDashboard = () => {
    history.replace('/dashboard');
  };

  if (user) {
    setTeamId(user.uid.replace(/-.+$/, ''));
    setUid(user.uid);
  }

  return (
    <Create
      {...{
        isLoading,
        create,
        success: toDashboard,
        cancel: toDashboard,
      }}
    />
  );
};

const CreateContainer: React.FC<Props> = (props) => (
  <OffersContainer.Provider>
    <CreateInner {...props} />
  </OffersContainer.Provider>
);

const CreateContainerWithRouter = withRouter(CreateContainer);

export { CreateContainerWithRouter as CreateContainer };
