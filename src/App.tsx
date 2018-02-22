import * as React from 'react';
import * as _ from 'lodash';
import * as Mousetrap from 'mousetrap';
import { ToastContainer, toast } from 'react-toastify';
import { observer, inject } from 'mobx-react';

import { AppStore } from './stores/AppStore';
import { KevoreeService } from './services/KevoreeService';
import { Topbar } from './components/topbar';
import { Sidebar } from './components/sidebar';
import { Diagram } from './components/diagram';

import './App.css';

interface AppProps {
  appStore?: AppStore;
  kevoreeService?: KevoreeService;
}

@inject('appStore', 'kevoreeService')
@observer
export default class App extends React.Component<AppProps> {

  private hkMap = {
    undo: ['ctrl+z', 'command+z'],
    redo: ['ctrl+y', 'command+y'],
    modelView:  ['esc', 'backspace'],
  };

  private hkActions = {
    undo: () => this.props.appStore!.undo(),
    redo: () => this.props.appStore!.redo(),
    modelView: () => this.props.kevoreeService!.openModelView(),
  };

  componentDidMount() {
    _.forEach(this.hkMap, (value, key) => Mousetrap.bind(value, this.hkActions[key]));
  }

  componentWillUnmount() {
    _.forEach(this.hkMap, (value) => Mousetrap.unbind(value));
  }

  render() {
    return (
      <div className="App">
        <Sidebar />
        <div className="App-content">
          <Topbar />
          <Diagram />
        </div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} className="Toastify" />
      </div>
    );
  }
}