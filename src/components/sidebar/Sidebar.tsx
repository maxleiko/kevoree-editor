import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';

import { SidebarStore } from '../../stores/SidebarStore';
import { KevoreeService } from '../../services/KevoreeService';
import { SidebarHeader } from './SidebarHeader';
import { SidebarGroup } from './SidebarGroup';

import './Sidebar.css';

interface SidebarProps {
  sidebarStore?: SidebarStore;
  kevoreeService?: KevoreeService;
}

interface SidebarState {
  loadAll: boolean;
}

@inject('sidebarStore', 'kevoreeService')
@observer
export class Sidebar extends React.Component<SidebarProps, SidebarState> {

  constructor(props: SidebarProps) {
    super(props);
    this.state = { loadAll: false };
  }

  loadAllNamespaces() {
    this.props.sidebarStore!.fetchNamespaces()
      .then(() => {
        this.setState({ loadAll: true });
      });
  }

  componentDidMount() {
    this.props.sidebarStore!.fetchNamespace('kevoree');
  }

  renderContent() {
    const { namespaces, namespacesMap } = this.props.sidebarStore!;

    if (namespaces.length === 0) {
      return <span className="Sidebar-content-empty">No result</span>;
    } else {
      return namespaces
        .map((ns) => (
          <SidebarGroup key={ns.name} store={namespacesMap.get(ns.name)!} />
        ));
    }
  }

  renderLoadAll() {
    // TODO change that with a "reload from registry" feature
    if (!this.state.loadAll) {
      return (
        <div>
          <a href="#" onClick={() => this.loadAllNamespaces()}>Load all namespaces</a>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="Sidebar">
        <SidebarHeader />
        <div className="Sidebar-content">
          <Scrollbars>
            {this.renderContent()}
            {this.renderLoadAll()}
          </Scrollbars>
        </div>
      </div>
    );
  }
}
