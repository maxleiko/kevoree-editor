import * as React from 'react';
import { observer, inject } from 'mobx-react';

import { RegistryStore } from '../../stores';

import './SidebarHeader.css';

interface SidebarHeaderProps {
  registryStore?: RegistryStore;
}

@inject('registryStore')
@observer
export class SidebarHeader extends React.Component<SidebarHeaderProps> {

  render() {
    const registryStore = this.props.registryStore!;

    return (
      <div className="Sidebar-header">
        <div className="input-group input-group-sm">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1"><i className="fa fa-search" /></span>
          </div>
          <input
            type="text"
            className="form-control"
            value={registryStore.nameFilter}
            onChange={(e) => registryStore.onChangeNameFilter(e)}
          />
        </div>
      </div>
    );
  }
}