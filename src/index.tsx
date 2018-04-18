import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TinyConf from 'tiny-conf';
import { Provider } from 'mobx-react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@leiko/react-diagrams/dist/style.min.css';
import './assets/font-awesome/css/font-awesome.min.css';

import { services, stores } from './kernel';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

TinyConf.set('registry', { host: 'registry.kevoree.org', port: 443, ssl: true });

ReactDOM.render(
  <Provider {...services} {...stores}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
