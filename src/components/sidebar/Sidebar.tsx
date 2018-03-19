import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { toast } from 'react-toastify';

import { RegistryStore } from '../../stores/RegistryStore';
import { KevoreeService } from '../../services/KevoreeService';
import { SidebarHeader } from './SidebarHeader';
import { SidebarGroup } from './SidebarGroup';
import { CustomScrollbar } from '../scrollbars';

import './Sidebar.css';

interface SidebarProps {
  registryStore?: RegistryStore;
  kevoreeService?: KevoreeService;
}

@inject('registryStore', 'kevoreeService')
@observer
export class Sidebar extends React.Component<SidebarProps> {

  componentDidMount() {
    this.props.registryStore!.fetchAll();
  }

  render() {
    if (this.props.registryStore!.error) {
      toast.error(<span><strong>Error: </strong>Unable to fetch data from the Kevoree registry</span>);
    }

    return (
      <div className="Sidebar">
        <SidebarHeader />
        <div className="Sidebar-content">
          <CustomScrollbar>
            <SidebarGroup name="Nodes" tdefs={this.props.registryStore!.nodes} />
            <SidebarGroup name="Components" tdefs={this.props.registryStore!.components} />
            <SidebarGroup name="Channels" tdefs={this.props.registryStore!.channels} />
            <SidebarGroup name="Groups" tdefs={this.props.registryStore!.groups} />
          </CustomScrollbar>
        </div>
      </div>
    );
  }
}
