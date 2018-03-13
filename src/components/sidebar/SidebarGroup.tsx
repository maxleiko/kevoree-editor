import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { toast } from 'react-toastify';

import { SidebarGroupStore } from '../../stores/SidebarGroupStore';
import { DiagramStore } from '../../stores/DiagramStore';
import { KevoreeService } from '../../services/KevoreeService';
import { SidebarItem } from './SidebarItem';
import { Collapsible } from '../collapsible';

import './SidebarGroup.css';
import { ITypeDefinition } from 'kevoree-registry-client';

export interface SidebarGroupProps {
  store: SidebarGroupStore;
  diagramStore?: DiagramStore;
  kevoreeService?: KevoreeService;
}

@inject('kevoreeService', 'diagramStore')
@observer
export class SidebarGroup extends React.Component<SidebarGroupProps> {

  onCreateInstance(tdef: ITypeDefinition) {
    try {
      this.props.kevoreeService!.createInstance(tdef, this.props.diagramStore!.path);
    } catch (err) {
      toast.error(err.message);
    }
  }

  componentDidMount() {
    this.props.store!.fetchTdefs();
  }

  renderContent() {
    const { tdefs, filteredTdefs } = this.props.store!;
    let content;

    if (tdefs.length === 0) {
      content = <span className="SidebarGroup-empty">Empty namespace</span>;
    } else if (filteredTdefs.length === 0) {
      content = <span className="SidebarGroup-empty">No result</span>;
    } else {
      content = filteredTdefs.map((tdef) => (
        <SidebarItem
          key={`${tdef.namespace!}.${tdef.name}`}
          tdef={tdef}
          onDblClick={() => this.onCreateInstance(tdef)}
        />
      ));
    }

    return <div className="SidebarGroup-content">{content}</div>;
  }

  renderHeader() {
    const { namespace, tdefs, filteredTdefs } = this.props.store!;

    return (
      <div className="SidebarGroup-header">
        <div>
          <i className="SidebarGroup-header-icon fa fa-th-list" />
          <span className="SidebarGroup-header-title">{namespace.name}</span>
        </div>
        <span className="SidebarGroup-header-details">{filteredTdefs.length}/{tdefs.length}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="SidebarGroup">
        <Collapsible
          header={this.renderHeader()}
          content={this.renderContent()}
        />
      </div>
    );
  }
}