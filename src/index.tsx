import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { spy } from 'mobx';
import { Provider } from 'mobx-react';

import App from './App';
import stores from './stores';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'storm-react-diagrams/dist/style.min.css';
import './assets/font-awesome/css/font-awesome.min.css';
import './index.css';

spy((event) => {
  if (event.type === 'action') {
    // tslint:disable-next-line
    console.log(`MobX "${event.name}":`, event.arguments);
  }
});

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
