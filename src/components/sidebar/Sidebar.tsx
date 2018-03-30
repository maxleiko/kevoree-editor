import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { toast } from 'react-toastify';

import { RegistryStore } from '../../stores';
import { SidebarHeader } from './SidebarHeader';
import { SidebarGroup } from './SidebarGroup';
import { CustomScrollbar } from '../scrollbars';

import './Sidebar.scss';

interface SidebarProps {
  registryStore?: RegistryStore;
}

@inject('registryStore')
@observer
export class Sidebar extends React.Component<SidebarProps> {

  componentDidMount() {
    this.props.registryStore!.fetchAll()
      .then(() => null, (err) => {
        toast.error(<span><strong>Error: </strong>Unable to fetch data from the Kevoree registry</span>);
      });
  }

  render() {
    return (
      <div className="Sidebar">
        <SidebarHeader />
        <div className="content">
          <CustomScrollbar>
            <div className="inner">
              <SidebarGroup name="Nodes" tdefs={this.props.registryStore!.nodes} />
              <SidebarGroup name="Components" tdefs={this.props.registryStore!.components} />
              <SidebarGroup name="Channels" tdefs={this.props.registryStore!.channels} />
              <SidebarGroup name="Groups" tdefs={this.props.registryStore!.groups} />
            </div>
          </CustomScrollbar>
        </div>
      </div>
    );
  }
}
