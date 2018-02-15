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
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button"><i className="fa fa-" /></button>
          </div>
        </div>
        <div className="Sidebar-checkbox-filters">
          <div className="form-check form-check-inline">
            <input
              id="Sidebar-node-filter"
              className="form-check-input"
              type="checkbox"
              checked={sidebarStore.nodeFilter}
              onChange={(e) => sidebarStore.onChangeNodeFilter(e)}
            />
            <label className="form-check-label" htmlFor="Sidebar-node-filter">Node</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              id="Sidebar-group-filter"
              className="form-check-input"
              type="checkbox"
              checked={sidebarStore.groupFilter}
              onChange={(e) => sidebarStore.onChangeGroupFilter(e)}
            />
            <label className="form-check-label" htmlFor="Sidebar-group-filter">Group</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              id="Sidebar-chan-filter"
              className="form-check-input"
              type="checkbox"
              checked={sidebarStore.chanFilter}
              onChange={(e) => sidebarStore.onChangeChanFilter(e)}
            />
            <label className="form-check-label" htmlFor="Sidebar-chan-filter">Chan</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              id="Sidebar-comp-filter"
              className="form-check-input"
              type="checkbox"
              checked={sidebarStore.compFilter}
              onChange={(e) => sidebarStore.onChangeCompFilter(e)}
            />
            <label className="form-check-label" htmlFor="Sidebar-comp-filter">Comp</label>
          </div>
        </div>
      </div>
    );
  }
}