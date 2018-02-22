import * as React from 'react';
import { inject } from 'mobx-react';
import * as kevoree from 'kevoree-library';
import { Scrollbars } from 'react-custom-scrollbars';

import { KevoreeService } from '../../services/KevoreeService';
import { RegistryService } from '../../services/RegistryService';
import { SidebarHeader } from './SidebarHeader';
import { SidebarGroup } from './SidebarGroup';

import './Sidebar.css';

interface SidebarProps {
  kevoreeService?: KevoreeService;
  registryService?: RegistryService;
}

interface SidebarState {
  loadAll: boolean;
}

@inject('kevoreeService', 'registryService')
export class Sidebar extends React.Component<SidebarProps, SidebarState> {

  private _listener: kevoree.KevoreeModelListener = {
    elementChanged: (event) => {
      if (event.elementAttributeName === 'packages') {
        this.forceUpdate();
      }
    }
  };

  constructor(props: SidebarProps) {
    super(props);
    this.state = { loadAll: false };
  }

  loadAllNamespaces() {
    this.props.registryService!.namespaces()
      .then(() => {
        this.setState({ loadAll: true });
      });
  }

  componentDidMount() {
    const { kevoreeService, registryService } = this.props;
    kevoreeService!.model.addModelElementListener(this._listener);
    registryService!.namespace('kevoree');
  }

  componentWillUnmount() {
    this.props.kevoreeService!.model.removeModelElementListener(this._listener);
  }

  renderContent() {
    const namespaces = this.props.kevoreeService!.namespaces;

    if (namespaces.length === 0) {
      return <span className="Sidebar-content-empty">No result</span>;
    } else {
      return this.props.kevoreeService!.namespaces
        .sort((ns0, ns1) => {
          if (ns0.name === 'kevoree') { return -1; }
          if (ns0.name > ns1.name) { return 1; }
          if (ns1.name > ns0.name) { return -1; }
          return 0;
        })
        .map((ns) => (
          <SidebarGroup key={ns.name} namespace={ns} />
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
