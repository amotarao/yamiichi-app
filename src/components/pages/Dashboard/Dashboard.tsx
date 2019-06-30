/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Fab, Icon, Toolbar, AppBar, Typography } from '@material-ui/core';
import { LoadingCircle } from '../../atoms/LoadingCircle';
import { AvatarButtonContainer } from '../../organisms/AvatarButton';
import { OffersListContainer } from '../../organisms/OffersList';
import { FabStyle, ListStyle, ContainerStyle } from './styled';

export interface DashboardProps {
  isLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isLoading }) => {
  return (
    <div css={ContainerStyle}>
      <LoadingCircle isLoading={isLoading} />
      <AppBar color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit" component="h1">
            Dashboard
          </Typography>
          <AvatarButtonContainer />
        </Toolbar>
      </AppBar>
      <OffersListContainer css={ListStyle} />
      <Fab css={FabStyle} color="primary" aria-label="Add" component={(props) => <Link to="/create" {...props} />}>
        <Icon>add</Icon>
      </Fab>
    </div>
  );
};
