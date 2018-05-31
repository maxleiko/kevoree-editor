import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as cx from 'classnames';
import Resizable from 're-resizable';

import { SelectionPanelStore, KevoreeStore } from '../../stores';
import { InstanceDetails } from '../kevoree/instance-details';
import { BindingDetails } from '../kevoree/binding-details';
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
    const { selection, selectedInstances, selectedBindings } = this.props.kevoreeStore!;
    const { width, minWidth, setWidth } = this.props.selectionPanelStore!;

    // tslint:disable-next-line
    console.log('==== selection ====');
    // tslint:disable-next-line
    console.log(selection);

    // TODO optimize this component in order to split "width" and "height" re-renders from the full selection re-render
    return (
      <Resizable
        className={cx('SelectionPanel', { hide: selection.length === 0 })}
        defaultSize={{ width, height: 'auto' }}
        minWidth={minWidth}
        enable={{ left: true }}
        onResizeStop={(e, dir, el, d) => setWidth(width + d.width)}
      >
        <CustomScrollbar>
          <div className="content">
            {selectedInstances.map((instance) => <InstanceDetails key={instance.path} instance={instance} />)}
            {selectedBindings.map((binding) => <BindingDetails key={binding.path} binding={binding} />)}
          </div>
        </CustomScrollbar>
      </Resizable>
    );
  }
}
