import * as React from 'react';
import * as kevoree from 'kevoree-library';
import * as cx from 'classnames';
import * as ColorHash from 'color-hash';
import { getType } from '../../utils/kevoree';

import { DND_ITEM } from '../../utils/constants';

import './SidebarItem.css';

export interface SidebarItemProps {
  tdef: kevoree.TypeDefinition;
  onDblClick: () => void;
}

const color = new ColorHash();

export const SidebarItem = ({ tdef, onDblClick = () => {/*noop*/}}: SidebarItemProps) => (
  <div
    className={cx('SidebarItem', `SidebarItem-${getType(tdef)}`)}
    draggable={true}
    onDragStart={(event) => event.dataTransfer.setData(DND_ITEM, tdef.path())}
    onDoubleClick={() => onDblClick()}
    style={{ backgroundColor: color.hex(tdef.name) }}
  >
    {tdef.name}
  </div>
);