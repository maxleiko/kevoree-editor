import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';
import * as cx from 'classnames';

import { KevoreeNodeModel } from './KevoreeNodeModel';
import { Editable } from '../../components/editable';

import './KevoreeNodeWidget.css';

export interface KevoreeNodeWidgetProps {
  node: KevoreeNodeModel;
  diagramEngine: DiagramEngine;
}

interface KevoreeNodeWidgetState {
  canDrop: boolean;
}

export class KevoreeNodeWidget extends React.Component<KevoreeNodeWidgetProps, KevoreeNodeWidgetState> {

  private _elem: HTMLDivElement;
  private _listener: kevoree.KevoreeModelListener = {
    elementChanged: (event) => {
      this.forceUpdate();
    }
  };

  constructor(props: KevoreeNodeWidgetProps) {
    super(props);
    this.state = { canDrop: false };
  }

  componentDidMount() {
    this.props.node.setWidth(this._elem.getBoundingClientRect().width);
    this.props.node.setHeight(this._elem.getBoundingClientRect().height);

    this.props.node.instance.addModelTreeListener(this._listener);
  }

  componentWillUnmount() {
    this.props.node.instance.removeModelTreeListener(this._listener);
  }

  render() {
    return (
      <div
        ref={(elem) => this._elem = elem!}
        className={cx('basic-node', 'kevoree-node', { droppable: this.state.canDrop })}
        style={{ backgroundColor: this.props.node.color }}
      >
        <div className="header">
          <Editable
            value={this.props.node.instance.name}
            onCommit={(name) => this.props.node.instance.name = name}
            className="inline-input"
          />
          <span>{this.props.node.instance.typeDefinition.name}</span>
        </div>
        <div className="body">
          <ul className="components">
            {this.props.node.components.map((comp) => (
              <li key={comp.instance.name}>{comp.instance.name}: {comp.instance.typeDefinition.name}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}