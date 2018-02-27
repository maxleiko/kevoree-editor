import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Collapse } from 'reactstrap';

import { SidebarGroupStore } from '../../stores/SidebarGroupStore';
import { KevoreeService } from '../../services/KevoreeService';
import { SidebarItem } from './SidebarItem';

import './SidebarGroup.css';

export interface SidebarGroupProps {
  store: SidebarGroupStore;
  kevoreeService?: KevoreeService;
}

interface SidebarGroupState {
  isOpen: boolean;
}

@inject('kevoreeService')
@observer
export class SidebarGroup extends React.Component<SidebarGroupProps, SidebarGroupState> {

  constructor(props: SidebarGroupProps) {
    super(props);
    this.state = { isOpen: true };
  }

  onToggle() {
    this.setState({ isOpen: !this.state.isOpen });
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
        onDblClick={() => this.props.kevoreeService!.createInstance(tdef)}
      />
    ));
  }

  render() {
    const { namespace, tdefs, filteredTdefs } = this.props.store!;

    return (
      <div className="SidebarGroup">
        <div className="SidebarGroup-header" onClick={() => this.onToggle()}>
          <div>
            <i className="SidebarGroup-header-icon fa fa-th-list" />
            <span className="SidebarGroup-header-title">{namespace.name}</span>
          </div>
          <span className="SidebarGroup-header-details">{filteredTdefs.length}/{tdefs.length}</span>
        </div>
        <Collapse className="SidebarGroup-body" isOpen={this.state.isOpen}>
          {this.renderBody()}
        </Collapse>
      </div>
    );
  }
}