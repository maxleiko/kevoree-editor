import * as React from 'react';
import { observer, inject } from 'mobx-react';

import { SidebarStore } from '../../stores/SidebarStore';

import './SidebarHeader.css';

interface SidebarHeaderProps {
  sidebarStore?: SidebarStore;
}

@inject('sidebarStore')
@observer
export class SidebarHeader extends React.Component<SidebarHeaderProps> {

  render() {
    const sidebarStore = this.props.sidebarStore!;

    return (
      <div className="Sidebar-header">
        <div className="input-group input-group-sm">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1"><i className="fa fa-search" /></span>
          </div>
          <input
            type="text"
            className="form-control"
            value={sidebarStore.nameFilter}
            onChange={(e) => sidebarStore.onChangeNameFilter(e)}
          />
        </div>
      </div>
    );
  }
}