import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import { GlobalStyle } from '../src/constants/GlobalStyle';

const req = require.context('../src', true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

const withGlobal = (cb) => (
  <React.Fragment>
    <GlobalStyle />
    {cb()}
  </React.Fragment>
);

addDecorator(withGlobal);

configure(loadStories, module);
