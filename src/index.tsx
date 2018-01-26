import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/scss/bootstrap.scss';
import 'storm-react-diagrams/dist/style.min.css';
import './assets/font-awesome/css/font-awesome.min.css';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
