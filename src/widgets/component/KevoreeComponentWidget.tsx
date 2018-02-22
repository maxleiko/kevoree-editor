import * as React from 'react';
import { DiagramEngine, DefaultPortModel, DefaultPortLabel } from 'storm-react-diagrams';
import { KevoreeComponentModel } from './KevoreeComponentModel';

import { Editable } from '../../components/editable';

import './KevoreeComponentWidget.css';

export interface KevoreeComponentWidgetProps {
  node: KevoreeComponentModel;
  diagramEngine: DiagramEngine;
}

export class KevoreeComponentWidget extends React.Component<KevoreeComponentWidgetProps, {}> {

  constructor(props: KevoreeComponentWidgetProps) {
    super(props);
    this.state = {};
  }

  generatePort(port: DefaultPortModel) {
    return <DefaultPortLabel model={port} key={port.id} />;
  }

  render() {
    return (
      <div className="basic-node kevoree-component" style={{ background: this.props.node.color }}>
        <div className="header" style={{ backgroundColor: this.props.node.color }}>
          <Editable
            value={this.props.node.instance.name}
            onCommit={(name) => this.props.node.instance.name = name}
            className="name"
          />
          <span className="type">{this.props.node.instance.typeDefinition.name}</span>
        </div>
        <div className="ports">
          <div className="in">{this.props.node.getInPorts().map(this.generatePort.bind(this))}</div>
          <div className="out">{this.props.node.getOutPorts().map(this.generatePort.bind(this))}</div>
        </div>
      </div>
    );
  }
}