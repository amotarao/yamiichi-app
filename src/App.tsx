import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'unstated';
import { TopContainer } from './components/pages/Top';
import { CallbackContainer } from './components/pages/Callback';
import { DashboardContainer } from './components/pages/Dashboard';
import { CreateContainer } from './components/pages/Create';
import { GlobalStyle } from './constants/GlobalStyle';

const App: React.FC = () => (
  <Provider>
    <GlobalStyle />
    <Router>
      <Route path="/" exact component={TopContainer} />
      <Route path="/callback" component={CallbackContainer} />
      <Route path="/dashboard" component={DashboardContainer} />
      <Route path="/create" component={CreateContainer} />
    </Router>
  </Provider>
);

export default App;
