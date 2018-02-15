import * as React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { observer, inject } from 'mobx-react';

import { SidebarStore } from '../../stores/SidebarStore';
import { KevoreeStore } from '../../stores/KevoreeStore';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

import './Sidebar.css';

interface SidebarProps {
  sidebarStore?: SidebarStore;
  kevoreeStore?: KevoreeStore;
}

@inject('sidebarStore', 'kevoreeStore')
@observer
export class Sidebar extends React.Component<SidebarProps> {

  render() {
    return (
      <div className="Sidebar">
        <SidebarHeader />
        <div className="Sidebar-content">
          <Scrollbars autoHide={true}>
            <div className="Sidebar-innerscroll">
              {this.props.sidebarStore!.filtered.map((tdef) =>
                <SidebarItem
                  key={tdef.path()}
                  tdef={tdef}
                  onDblClick={() => this.props.kevoreeStore!.createInstance(tdef)}
                />
              )}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}
