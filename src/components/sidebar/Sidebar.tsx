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
    this.props.sidebarStore!.fetchAll();
  }

  render() {
    // tslint:disable-next-line
    console.log('render sidebar');
    if (this.props.sidebarStore!.error) {
      toast.error(<span><strong>Error: </strong>Unable to fetch data from the Kevoree registry</span>);
    }

    return (
      <div className="Sidebar">
        <SidebarHeader />
        <div className="Sidebar-content">
          <Scrollbars>
            <SidebarGroup name="Nodes" tdefs={this.props.sidebarStore!.nodes} />
            <SidebarGroup name="Components" tdefs={this.props.sidebarStore!.components} />
            <SidebarGroup name="Channels" tdefs={this.props.sidebarStore!.channels} />
            <SidebarGroup name="Groups" tdefs={this.props.sidebarStore!.groups} />
          </Scrollbars>
        </div>
      </div>
    );
  }
}
