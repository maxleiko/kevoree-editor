import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import { KevoreeComponentModel } from '../models/KevoreeComponentModel';

import { Editable } from '../../editable';

import './KevoreeComponentWidget.scss';
import { KevoreePortModel } from '../models/KevoreePortModel';
import { KevoreePortWidget } from '../widgets/KevoreePortWidget';

export interface KevoreeComponentWidgetProps {
  node: KevoreeComponentModel;
  diagramEngine: DiagramEngine;
}

export class KevoreeComponentWidget extends React.Component<KevoreeComponentWidgetProps, {}> {

  private _elem: HTMLDivElement | null;

  constructor(props: KevoreeComponentWidgetProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this._elem) {
      this.props.node.width = this._elem.getBoundingClientRect().width;
      this.props.node.height = this._elem.getBoundingClientRect().height;
    }
  }

  generatePort(port: KevoreePortModel) {
    return <KevoreePortWidget model={port} key={port.id} />;
  }

  render() {
    const instance = this.props.node.instance!;
    const { r, g, b } = this.props.node.color;

    return (
      <div
        ref={(elem) => this._elem = elem}
        className="kevoree-component"
        style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
      >
        <div className="header">
          <Editable
            value={instance.name}
            onCommit={(name) => instance.name = name}
            className="name"
          />
          <span className="type">{instance.typeDefinition.name}</span>
        </div>
        <div className="ports">
          <div className="in">{this.props.node.getInputs().map((port) => this.generatePort(port))}</div>
          <div className="out">{this.props.node.getOutputs().map((port) => this.generatePort(port))}</div>
        </div>
      </div>
    );
  }
}