import * as React from 'react';

import './Sidebar.css';

interface SidebarProps {}
interface SidebarState {}

export class Sidebar extends React.Component<SidebarProps & React.HTMLAttributes<HTMLDivElement>, SidebarState> {

  render() {
    return (
      <div className="Sidebar">{this.props.children}</div>
    );
  }

}
