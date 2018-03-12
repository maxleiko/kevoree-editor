import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TinyConf from 'tiny-conf';
import { Provider } from 'mobx-react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'storm-react-diagrams/dist/style.min.css';
import './assets/font-awesome/css/font-awesome.min.css';

import { KevoreeService, RegistryService, FileService } from './services';
import { DiagramStore, SidebarStore, SelectionPanelStore } from './stores';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

TinyConf.set('registry', { host: 'registry.kevoree.org', port: 443, ssl: true });

// ==================== Injectables ======================
const services = {
  kevoreeService: new KevoreeService(),
  fileService: new FileService(),
  registryService: new RegistryService(),
};

const selectionPanelStore = new SelectionPanelStore();

const stores = {
  sidebarStore: new SidebarStore(services.registryService),
  diagramStore: new DiagramStore(services.kevoreeService),
  selectionPanelStore,
};
// ========================================================

ReactDOM.render(
  <Provider {...services} {...stores}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
