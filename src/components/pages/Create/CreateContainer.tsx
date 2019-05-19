import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Subscribe } from 'unstated';
import { UserContainer } from '../../../stores/user';
import { OffersContainer } from '../../../stores/database/offers';
import { Create, CreateProps } from './';

interface Props extends RouteComponentProps, Partial<CreateProps> {}

const CreateContainer: React.FC<Props> = ({ history }) => {
  return (
    <Subscribe to={[UserContainer, OffersContainer]}>
      {(user: UserContainer, offers: OffersContainer) => {
        if (!user.state.isLoading && !user.state.signedIn) {
          history.replace('/');
        }
        const toDashboard = () => {
          history.replace('/dashboard');
        };
        const isLoading = user.state.isLoading || offers.state.isLoading;

        const newProps: CreateProps = {
          isLoading,
          user: user.state.user!,
          create: offers.create,
          success: toDashboard,
          cancel: toDashboard,
        };
        return <Create {...newProps} />;
      }}
    </Subscribe>
  );
};

const CreateContainerWithRouter = withRouter(CreateContainer);

export { CreateContainerWithRouter as CreateContainer };
