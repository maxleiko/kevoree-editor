import * as React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { SidebarItemProps } from './SidebarItem';

import './Sidebar.css';

interface SidebarProps {
  children: React.ReactElement<SidebarItemProps>[];
}

export const Sidebar = ({ children }: SidebarProps) => (
  <div className="Sidebar">
    <Scrollbars autoHide={true}>
      <div className="Sidebar-inner">{children}</div>
    </Scrollbars>
  </div>
);
