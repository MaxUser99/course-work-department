import React from 'react';
import ReactDOM from 'react-dom';

import App from 'containers/App';
import { RecoilRoot } from 'recoil';
import { LocationProvider } from '@reach/router';

ReactDOM.render(
  <RecoilRoot>
    <LocationProvider>
      <App />
    </LocationProvider>
  </RecoilRoot>,
  document.getElementById('root'),
);
