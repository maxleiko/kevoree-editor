import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { toast } from 'react-toastify';

import { KevoreeStore } from '../../stores';
import { SidebarItem } from './SidebarItem';
import { Collapsible } from '../collapsible';

import './SidebarGroup.css';
import { ITypeDefinition } from 'kevoree-registry-client';

export interface SidebarGroupProps {
  name: string;
  tdefs: ITypeDefinition[];
  kevoreeStore?: KevoreeStore;
}

@inject('kevoreeStore')
@observer
export class SidebarGroup extends React.Component<SidebarGroupProps> {

  onCreateInstance(tdef: ITypeDefinition) {
    try {
      this.props.kevoreeStore!.createInstance(tdef);
    } catch (err) {
      toast.error(err.message);
    }
  }

  renderHeader() {
    const { tdefs } = this.props!;

    return (
      <div className="SidebarGroup-header">
        <div>
          <i className="SidebarGroup-header-icon fa fa-th-list" />
          <span className="SidebarGroup-header-title">{this.props.name}</span>
        </div>
        <span className="SidebarGroup-header-details">{tdefs.length}/{tdefs.length}</span>
      </div>
    );
  }

  renderContent() {
    const { tdefs } = this.props;

    if (tdefs.length === 0) {
      return <span className="SidebarGroup-empty">Empty</span>;
    }
    
    return tdefs.map((tdef) => (
      <SidebarItem
        key={`${tdef.namespace!}.${tdef.name}/${tdef.version}`}
        tdef={tdef}
        onDblClick={() => this.onCreateInstance(tdef)}
      />
    ));
  }

  render() {
    return (
      <Collapsible
        className="SidebarGroup"
        header={this.renderHeader()}
        content={this.renderContent()}
      />
    );
  }
}