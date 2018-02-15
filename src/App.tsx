import * as React from 'react';
import { observer, inject } from 'mobx-react';

import { AppStore } from './stores/AppStore';
import { KevoreeStore } from './stores/KevoreeStore';
import { Sidebar } from './components/sidebar';
import { Diagram } from './components/diagram';

import './App.css';
import { KevoreeNodeFactory } from './widgets/node';
import { KevoreeComponentFactory } from './widgets/component';
import { KevoreeChannelFactory } from './widgets/channel';
import { KevoreeGroupFactory } from './widgets/group';

interface AppProps {
  appStore?: AppStore;
  kevoreeStore?: KevoreeStore;
}

@inject('appStore', 'kevoreeStore')
@observer
export default class App extends React.Component<AppProps, {}> {

  componentWillMount() {
    this.props.kevoreeStore!.diagram.registerNodeFactory(new KevoreeComponentFactory());
    this.props.kevoreeStore!.diagram.registerNodeFactory(new KevoreeNodeFactory());
    this.props.kevoreeStore!.diagram.registerNodeFactory(new KevoreeChannelFactory());
    this.props.kevoreeStore!.diagram.registerNodeFactory(new KevoreeGroupFactory());
    this.props.kevoreeStore!.diagram.installDefaultFactories();
  }

  render() {
    // tslint:disable-next-line
    console.log('render App');
    const { appStore, kevoreeStore } = this.props;

    return (
      <div className="App">
        <div style={{ position: 'absolute', top: 5, right: 5, zIndex: 1, color: '#fff' }}>
          <div>Mode: {appStore!.mode}</div>
          <button onClick={() => appStore!.changeMode()}>Switch mode</button>
          <div>Nodes: {kevoreeStore!.nodes.length}</div>
        </div>
        <Sidebar />
        <Diagram />
    </div>
    );
  }
}