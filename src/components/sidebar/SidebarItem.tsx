import * as React from 'react';

import { TypeDefinition } from '../../types/kevoree.d';
import { DND_ITEM } from '../../utils/constants';

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
    onDragStart={(event) => event.dataTransfer.setData(DND_ITEM, JSON.stringify(tdef))}
    onDoubleClick={() => onDblClick()}
  >
    {tdef.name}
  </div>
);
