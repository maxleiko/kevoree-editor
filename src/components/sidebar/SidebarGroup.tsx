import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Collapse } from 'reactstrap';
import { toast } from 'react-toastify';

import { SidebarGroupStore } from '../../stores/SidebarGroupStore';
import { DiagramStore } from '../../stores/DiagramStore';
import { KevoreeService } from '../../services/KevoreeService';
import { SidebarItem } from './SidebarItem';

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

  constructor(props: SidebarGroupProps) {
    super(props);
    this.state = { isOpen: true };
  }

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

  renderBody() {
    const { tdefs, filteredTdefs } = this.props.store!;

    if (tdefs.length === 0) {
      return <span className="SidebarGroup-empty">Empty namespace</span>;
    }
    
    if (filteredTdefs.length === 0) {
      return <span className="SidebarGroup-empty">No result</span>;
    }

    return filteredTdefs.map((tdef) => (
      <SidebarItem
        key={`${tdef.namespace!}.${tdef.name}`}
        tdef={tdef}
        onDblClick={() => this.onCreateInstance(tdef)}
      />
    ));
  }

  render() {
    const { namespace, tdefs, filteredTdefs, isOpen, toggle } = this.props.store!;

    return (
      <div className="SidebarGroup">
        <div className="SidebarGroup-header" onClick={toggle}>
          <div>
            <i className="SidebarGroup-header-icon fa fa-th-list" />
            <span className="SidebarGroup-header-title">{namespace.name}</span>
          </div>
          <span className="SidebarGroup-header-details">{filteredTdefs.length}/{tdefs.length}</span>
        </div>
        <Collapse className="SidebarGroup-body" isOpen={isOpen}>
          {this.renderBody()}
        </Collapse>
      </div>
    );
  }
}