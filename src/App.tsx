import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { TopContainer } from './components/pages/Top';
import { CallbackContainer } from './components/pages/Callback';
import { DashboardContainer } from './components/pages/Dashboard';
import { CreateContainer } from './components/pages/Create';
import { GlobalStyle } from './constants/GlobalStyle';
import { UserContainer } from './stores/user';

const App: React.FC = () => (
  <UserContainer.Provider>
    <GlobalStyle />
    <Router>
      <Route path="/" exact component={TopContainer} />
      <Route path="/callback" component={CallbackContainer} />
      <Route path="/dashboard" component={DashboardContainer} />
      <Route path="/create" component={CreateContainer} />
    </Router>
  </UserContainer.Provider>
);

export default App;
