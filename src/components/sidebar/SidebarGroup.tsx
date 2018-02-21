import * as React from 'react';
import * as kevoree from 'kevoree-library';
import { inject, observer } from 'mobx-react';
import { Collapse } from 'reactstrap';

import { SidebarStore } from '../../stores/SidebarStore';
import { KevoreeService } from '../../services/KevoreeService';
import { RegistryService } from '../../services/RegistryService';
import { SidebarItem } from './SidebarItem';

import './SidebarGroup.css';

export interface SidebarGroupProps {
  namespace: kevoree.Namespace;
  sidebarStore?: SidebarStore;
  kevoreeService?: KevoreeService;
  registryService?: RegistryService;
}

interface SidebarGroupState {
  isOpen: boolean;
}

@inject('sidebarStore', 'kevoreeService', 'registryService')
@observer
export class SidebarGroup extends React.Component<SidebarGroupProps, SidebarGroupState> {

  private _listener: kevoree.KevoreeModelListener = {
    elementChanged: (event) => {
      if (event.elementAttributeName === 'typeDefinitions') {
        this.forceUpdate();
      }
    }
  };

  constructor(props: SidebarGroupProps) {
    super(props);
    this.state = { isOpen: true };
  }

  onToggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  componentDidMount() {
    const { registryService } = this.props;
    this.props.namespace.addModelElementListener(this._listener);
    registryService!.tdefs(this.props.namespace.name);
  }

  componentWillUnmount() {
    this.props.namespace.removeModelElementListener(this._listener);
  }

  renderBody() {
    const tdefs = this.props.namespace.typeDefinitions.array;
    const filteredTdefs = this.props.sidebarStore!.filteredTdefs(tdefs);
    
    if (filteredTdefs.length === 0) {
      return <span className="SidebarGroup-empty">No result</span>;
    }

    return filteredTdefs.map((tdef) => (
      <SidebarItem
        key={tdef.path()}
        tdef={tdef}
        onDblClick={() => this.props.kevoreeService!.createInstance(tdef)}
      />
    ));
  }

  render() {
    const ns = this.props.namespace;

    return (
      <div className="SidebarGroup">
        <div className="SidebarGroup-header" onClick={() => this.onToggle()}>
          <i className="SidebarGroup-header-icon fa fa-th-list" />
          <span className="SidebarGroup-header-title">{ns.name}</span>
        </div>
        <Collapse className="SidebarGroup-body" isOpen={this.state.isOpen}>
          {this.renderBody()}
        </Collapse>
      </div>
    );
  }
}