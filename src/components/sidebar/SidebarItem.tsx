import * as React from 'react';

import { TypeDefinition } from '../../types/kevoree.d';

import './SidebarItem.css';

interface SideBarItemProps {
  tdef: TypeDefinition;
  onDblClick: () => void;
}

export const SIDEBAR_ITEM_DT = 'sidebar-item';

export const SidebarItem = ({ tdef, onDblClick = () => {/*noop*/} }: SideBarItemProps) => (
  <div
    className={['SidebarItem', `SidebarItem-${tdef.type}`].join(' ')}
    draggable={true}
    onDragStart={(event) => event.dataTransfer.setData(SIDEBAR_ITEM_DT, JSON.stringify(tdef))}
    onDoubleClick={() => onDblClick()}
  >
    {tdef.name}
  </div>
);
