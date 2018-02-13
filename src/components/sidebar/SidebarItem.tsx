import * as React from 'react';
import * as cx from 'classnames';
import * as ColorHash from 'color-hash';

import { DND_ITEM } from '../../utils/constants';

import './SidebarItem.css';

export interface SidebarItemProps {
  tdef: k.TypeDefinition;
  onDblClick: () => void;
}

const color = new ColorHash();

export const SidebarItem = ({ tdef, onDblClick = () => {/*noop*/}}: SidebarItemProps) => (
  <div
    className={cx('SidebarItem', `SidebarItem-${tdef.type}`)}
    draggable={true}
    onDragStart={(event) => event.dataTransfer.setData(DND_ITEM, JSON.stringify(tdef))}
    onDoubleClick={() => onDblClick()}
    style={{ backgroundColor: color.hex(tdef.name) }}
  >
    {tdef.name}
  </div>
);