import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Collapse } from 'reactstrap';
import { toast } from 'react-toastify';

import { DiagramStore } from '../../stores/DiagramStore';
import { KevoreeService } from '../../services/KevoreeService';
import { SidebarItem } from './SidebarItem';

import './SidebarGroup.css';
import { ITypeDefinition } from 'kevoree-registry-client';

export interface SidebarGroupProps {
  name: string;
  tdefs: ITypeDefinition[];
  diagramStore?: DiagramStore;
  kevoreeService?: KevoreeService;
}

interface SidebarGroupState {
  isOpen: boolean;
}

@inject('kevoreeService', 'diagramStore')
@observer
export class SidebarGroup extends React.Component<SidebarGroupProps, SidebarGroupState> {

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

  renderBody() {
    const { tdefs } = this.props;

    if (tdefs.length === 0) {
      return <span className="SidebarGroup-empty">Empty</span>;
    }
    
    // if (filteredTdefs.length === 0) {
    //   return <span className="SidebarGroup-empty">No result</span>;
    // }

    return tdefs.map((tdef) => (
      <SidebarItem
        key={`${tdef.namespace!}.${tdef.name}/${tdef.version}`}
        tdef={tdef}
        onDblClick={() => this.onCreateInstance(tdef)}
      />
    ));
  }

  render() {
    const { tdefs } = this.props!;

    return (
      <div className="SidebarGroup">
        <div className="SidebarGroup-header" onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
          <div>
            <i className="SidebarGroup-header-icon fa fa-th-list" />
            <span className="SidebarGroup-header-title">{this.props.name}</span>
          </div>
          <span className="SidebarGroup-header-details">{tdefs.length}/{tdefs.length}</span>
        </div>
        <Collapse className="SidebarGroup-body" isOpen={this.state.isOpen}>
          {this.renderBody()}
        </Collapse>
      </div>
    );
  }
}