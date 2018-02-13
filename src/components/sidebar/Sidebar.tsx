import * as React from 'react';

import { SidebarItemProps } from './SidebarItem';

import './Sidebar.css';

interface SidebarProps {
  children: React.ReactElement<SidebarItemProps>[];
}

export const Sidebar = ({ children }: SidebarProps) => (
  <div className="Sidebar">{children}</div>
);
