import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TinyConf from 'tiny-conf';
import { Provider } from 'mobx-react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'storm-react-diagrams/dist/style.min.css';
import './assets/font-awesome/css/font-awesome.min.css';

import App from './App';
import * as services from './services';
import createStores from './stores';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

TinyConf.set('registry', { host: 'registry.kevoree.org', port: 443, ssl: true });

const stores = createStores(services);

ReactDOM.render(
  <Provider {...stores} {...services}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
