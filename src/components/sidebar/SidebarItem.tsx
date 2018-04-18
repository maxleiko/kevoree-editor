import * as React from 'react';
import * as cx from 'classnames';
import { observer } from 'mobx-react';

import { ITypeDefinition } from 'kevoree-registry-client';
import { inferType } from '../../utils/kevoree';
import { str2rgb } from '../../utils/colors';
import { DND_ITEM } from '../../utils/constants';

import './SidebarItem.scss';

export interface SidebarItemProps {
  tdef: ITypeDefinition;
  onDblClick: () => void;
}

export const SidebarItem = observer(({ tdef, onDblClick = () => {/*noop*/}}: SidebarItemProps) => {
  const { r, g, b } = str2rgb(tdef.name);
  
  return (
    <div
      className={cx('SidebarItem', `SidebarItem-${inferType(tdef)}`)}
      draggable={true}
      onDragStart={(event) => event.dataTransfer.setData(DND_ITEM, JSON.stringify(tdef))}
      onDoubleClick={() => onDblClick()}
      style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
    >
      <span className="type">{tdef.name}</span>
    </div>
  );
});