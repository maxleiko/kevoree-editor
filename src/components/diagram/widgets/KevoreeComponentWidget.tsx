import * as React from 'react';
import { observer } from 'mobx-react';
import { DiagramEngine } from 'storm-react-diagrams';
import { KevoreeComponentModel } from '../models/KevoreeComponentModel';

import { InstanceHeader } from '../../kevoree';

import './KevoreeComponentWidget.scss';
import { KevoreePortModel } from '../models/KevoreePortModel';
import { KevoreePortWidget } from '../widgets/KevoreePortWidget';

export interface KevoreeComponentWidgetProps {
  node: KevoreeComponentModel;
  diagramEngine: DiagramEngine;
}

@observer
export class KevoreeComponentWidget extends React.Component<KevoreeComponentWidgetProps> {

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
        <InstanceHeader
          className="header"
          instance={instance}
          alpha={0.4}
          rgb={{ r: 0, g: 0, b: 0 }}
          hoverable={false}
        />
        <div className="ports">
          <div className="in">{this.props.node.getInputs().map((port) => this.generatePort(port))}</div>
          <div className="out">{this.props.node.getOutputs().map((port) => this.generatePort(port))}</div>
        </div>
      </div>
    );
  }
}