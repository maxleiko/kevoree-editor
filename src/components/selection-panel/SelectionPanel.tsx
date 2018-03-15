import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as cx from 'classnames';
import Resizable from 're-resizable';

import { SelectionPanelStore, DiagramStore } from '../../stores';
import { KevoreeService } from '../../services/KevoreeService';
import { SelectionListener } from '../../listeners';
import { InstanceDetails } from '../instance-details';
import { CustomScrollbar } from '../scrollbars';

import './SelectionPanel.scss';
import { KevoreeServiceListener } from '../../services';

export interface SelectionPanelProps {
  diagramStore?: DiagramStore;
  selectionPanelStore?: SelectionPanelStore;
  kevoreeService?: KevoreeService;
}

@inject('kevoreeService', 'diagramStore', 'selectionPanelStore')
@observer
export class SelectionPanel extends React.Component<SelectionPanelProps> implements KevoreeServiceListener {

  private _listener = new SelectionListener(() => this.forceUpdate());

  modelChanged() {
    this.forceUpdate();
    this.props.kevoreeService!.model.addModelTreeListener(this._listener);
  }

  componentDidMount() {
    this.props.kevoreeService!.addListener(this);
    this.props.kevoreeService!.model.addModelTreeListener(this._listener);
  }

  componentWillUnmount() {
    this.props.kevoreeService!.removeListener(this);
    this.props.kevoreeService!.model.removeModelTreeListener(this._listener);
  }

  render() {
    const kService = this.props.kevoreeService!;
    const { width, minWidth, setWidth } = this.props.selectionPanelStore!;
    const selection = kService.getSelection(this.props.diagramStore!.path);

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
            {selection.map((instance) => <InstanceDetails key={instance.path()} instance={instance} />)}
          </div>
        </CustomScrollbar>
      </Resizable>
    );
  }
}