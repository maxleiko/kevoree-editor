import * as React from 'react';
import * as _ from 'lodash';
import * as Mousetrap from 'mousetrap';
import { ToastContainer, toast } from 'react-toastify';
import { observer, inject } from 'mobx-react';

import { DiagramStore } from './stores';
import { KevoreeService } from './services';
import { Topbar } from './components/topbar';
import { Sidebar } from './components/sidebar';
import { Diagram } from './components/diagram';
import { ModalContainer } from './components/modal';

import './App.css';

interface AppProps {
  diagramStore?: DiagramStore;
  kevoreeService?: KevoreeService;
}

@inject('diagramStore', 'kevoreeService')
@observer
export default class App extends React.Component<AppProps> {

  private hkMap = {
    undo: ['ctrl+z', 'command+z'],
    redo: ['ctrl+y', 'command+y'],
    previousView:  ['esc', 'backspace'],
  };

  private hkActions = {
    undo: () => toast.warn(<span><strong>undo:</strong> not implemented yet</span>),
    redo: () => toast.warn(<span><strong>redo:</strong> not implemented yet</span>),
    previousView: () => this.props.diagramStore!.previousView(),
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
        <ToastContainer
          className="Toastify"
          position={toast.POSITION.TOP_RIGHT}
        />
        <ModalContainer />
      </div>
    );
  }
}