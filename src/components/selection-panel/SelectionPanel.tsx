import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as cx from 'classnames';
import Resizable from 're-resizable';

import { SelectionPanelStore, KevoreeStore } from '../../stores';
import { InstanceDetails } from '../kevoree';
import { CustomScrollbar } from '../scrollbars';

import './SelectionPanel.scss';

export interface SelectionPanelProps {
  kevoreeStore?: KevoreeStore;
  selectionPanelStore?: SelectionPanelStore;
}

@inject('kevoreeStore', 'selectionPanelStore')
@observer
export class SelectionPanel extends React.Component<SelectionPanelProps> {

  render() {
    const { selection } = this.props.kevoreeStore!;
    const { width, minWidth, setWidth } = this.props.selectionPanelStore!;

    return (
      <Resizable
        className={cx('SelectionPanel', { 'hide': selection.length === 0 })}
        defaultSize={{ width, height: 'auto' }}
        minWidth={minWidth}
        enable={{ left: true }}
        onResizeStop={(e, dir, el, d) => setWidth(width + d.width)}
      >
        <CustomScrollbar>
          <div className="content">
            {selection.map((instance) => 
              <InstanceDetails key={instance.path} instance={instance} />
            )}
          </div>
        </CustomScrollbar>
      </Resizable>
    );
  }
}