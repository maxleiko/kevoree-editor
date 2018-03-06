import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';
import * as cx from 'classnames';
import { inject, observer } from 'mobx-react';

import { KevoreeService } from '../../../services/KevoreeService';
import { KevoreeNodeModel } from '../models/KevoreeNodeModel';
import { Editable } from '../../editable';

import './KevoreeNodeWidget.scss';

export interface KevoreeNodeWidgetProps {
  node: KevoreeNodeModel;
  diagramEngine: DiagramEngine;
  kevoreeService?: KevoreeService;
}

interface KevoreeNodeWidgetState {
  canDrop: boolean;
}

@inject('kevoreeService')
@observer
export class KevoreeNodeWidget extends React.Component<KevoreeNodeWidgetProps, KevoreeNodeWidgetState> {

  private _elem: HTMLDivElement | null;

  private _listener: kevoree.KevoreeModelListener = {
    elementChanged: (event) => {
      this.forceUpdate();
    }
  };

  constructor(props: KevoreeNodeWidgetProps) {
    super(props);
    this.state = { canDrop: false };
  }

  openNodeView() {
    this.props.kevoreeService!.openNodeView(this.props.node);
  }

  onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.keyCode === 13) {
      this.openNodeView();
    }
  }

  componentDidMount() {
    if (this._elem) {
      this.props.node.width = this._elem.getBoundingClientRect().width;
      this.props.node.height = this._elem.getBoundingClientRect().height;
    }

    this.props.node.instance!.addModelTreeListener(this._listener);
  }

  componentWillUnmount() {
    this.props.node.instance!.removeModelTreeListener(this._listener);
  }

  render() {
    const instance = this.props.node.instance!;
    const { r, g, b } = this.props.node.color;

    return (
      <div
        ref={(elem) => this._elem = elem}
        tabIndex={0}
        className={cx('kevoree-node', { droppable: this.state.canDrop })}
        onDoubleClick={() => this.openNodeView()}
        onKeyDown={(event) => this.onKeyDown(event)}
      >
        <div className="header" style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.8)` }}>
          <Editable
            value={instance.name}
            onCommit={(name) => instance.name = name}
            className="name"
          />
          <span className="type">{instance.typeDefinition.name}/{instance.typeDefinition.version}</span>
        </div>
        <div className="body">
          <ul className="components">
            {this.props.node.components.map((comp) => (
              <li key={comp.instance!.name}>{comp.instance!.name}: {comp.instance!.typeDefinition.name}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}