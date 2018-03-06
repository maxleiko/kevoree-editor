import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as kevoree from 'kevoree-library';
import * as cx from 'classnames';
import Resizable from 're-resizable';

import { SelectionPanelStore } from '../../stores/SelectionPanelStore';
import { AbstractModel } from '../diagram/models/AbstractModel';

import './SelectionPanel.scss';

export interface SelectionPanelProps {
  selectionPanelStore?: SelectionPanelStore;
}

@inject('selectionPanelStore')
@observer
export class SelectionPanel extends React.Component<SelectionPanelProps> {

  renderSelection(model: AbstractModel<kevoree.Instance>) {
    const instance = model.instance!;

    return (
      <li key={instance.path()}>{instance.name}: {instance.typeDefinition.name}/{instance.typeDefinition.version}</li>
    );
  }

  render() {
    const store = this.props.selectionPanelStore!;

    return (
      <Resizable
        className={cx('SelectionPanel', { 'hide': !store.isOpen })}
        defaultSize={{ width: store.width, height: 'auto' }}
        minWidth={store.minWidth}
        enable={{ left: true }}
        onResizeStop={(e, dir, el, d) => store.setWidth(store.width + d.width)}
      >
        <div className="content">
          <ul>
            {store.selection.map((model) => this.renderSelection(model))}
          </ul>
        </div>
      </Resizable>
    );
  }
}