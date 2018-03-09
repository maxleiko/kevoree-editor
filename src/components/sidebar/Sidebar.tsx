import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';
import { toast } from 'react-toastify';

import { SidebarStore } from '../../stores/SidebarStore';
import { KevoreeService } from '../../services/KevoreeService';
import { SidebarHeader } from './SidebarHeader';
import { SidebarGroup } from './SidebarGroup';

import './Sidebar.css';

interface SidebarProps {
  sidebarStore?: SidebarStore;
  kevoreeService?: KevoreeService;
}

@inject('sidebarStore', 'kevoreeService')
@observer
export class Sidebar extends React.Component<SidebarProps> {

  componentDidMount() {
    this.props.sidebarStore!.fetchNamespaces();
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

  render() {
    const error = this.props.sidebarStore!.error;
    if (error) {
      toast.error(<span><strong>Error: </strong>Unable to load namespace from registry</span>);
    }

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
