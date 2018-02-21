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

@inject('kevoreeService', 'registryService')
export class Sidebar extends React.Component<SidebarProps> {

  private _listener: kevoree.KevoreeModelListener = {
    elementChanged: (event) => {
      if (event.elementAttributeName === 'packages') {
        this.forceUpdate();
      }
    }
  };

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
      return this.props.kevoreeService!.namespaces.map((ns) => (
        <SidebarGroup key={ns.name} namespace={ns} />
      ));
    }
  }

  render() {
    return (
      <div className="Sidebar">
        <SidebarHeader />
        <div className="Sidebar-content">
          <Scrollbars>
            {this.renderContent()}
          </Scrollbars>
        </div>
      </div>
    );
  }
}
