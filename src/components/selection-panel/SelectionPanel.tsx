import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as kevoree from 'kevoree-library';
import * as cx from 'classnames';
import Resizable from 're-resizable';

import { SelectionPanelStore, DiagramStore } from '../../stores';
import { KevoreeService } from '../../services/KevoreeService';
import { SelectionListener } from '../../listeners';

import './SelectionPanel.scss';

export interface SelectionPanelProps {
  diagramStore?: DiagramStore;
  selectionPanelStore?: SelectionPanelStore;
  kevoreeService?: KevoreeService;
}

@inject('kevoreeService', 'diagramStore', 'selectionPanelStore')
@observer
export class SelectionPanel extends React.Component<SelectionPanelProps> {

  private _listener = new SelectionListener(() => this.forceUpdate());

  componentDidMount() {
    this.props.kevoreeService!.model.addModelTreeListener(this._listener);
  }

  componentWillUnmount() {
    this.props.kevoreeService!.model.removeModelTreeListener(this._listener);
  }

  renderInstance(instance: kevoree.Instance) {
    const tdef = instance.typeDefinition ? instance.typeDefinition : { name: '???', version: -1 };

    return (
      <li key={instance.path()}>{instance.name}: {tdef.name}/{tdef.version}</li>
    );
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
        <div className="content">
          <ul>
            {selection.map((instance) => this.renderInstance(instance))}
          </ul>
        </div>
      </Resizable>
    );
  }
}