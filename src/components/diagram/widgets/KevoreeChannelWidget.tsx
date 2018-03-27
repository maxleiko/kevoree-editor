import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';

import { KevoreeChannelModel } from '../models/KevoreeChannelModel';
import { InstanceHeader } from '../../kevoree';

import './KevoreeChannelWidget.scss';
import { KevoreeChannelPortModel } from '../models/KevoreeChannelPortModel';
import { KevoreePortWidget } from './KevoreePortWidget';

export interface KevoreeChannelWidgetProps {
  node: KevoreeChannelModel;
  diagramEngine: DiagramEngine;
}

interface KevoreeChannelWidgetState {}

export class KevoreeChannelWidget extends React.Component<KevoreeChannelWidgetProps, KevoreeChannelWidgetState> {

  private _elem: HTMLDivElement | null;

  constructor(props: KevoreeChannelWidgetProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this._elem) {
      this.props.node.width = this._elem.getBoundingClientRect().width;
      this.props.node.height = this._elem.getBoundingClientRect().height;
    }
  }

  generatePort(port: KevoreeChannelPortModel) {
    return <KevoreePortWidget key={port.id} model={port} />;
  }

  render() {
    const { r, g, b } = this.props.node.color;

    return (
      <div
        ref={(elem) => this._elem = elem}
        className="kevoree-channel"
        style={{ background: `rgb(${r}, ${g}, ${b})` }}
      >
        <InstanceHeader instance={this.props.node.instance} hoverable={false} />
        <div className="ports">
          <div className="in">{this.generatePort(this.props.node.getInputs())}</div>
          <div className="out">{this.generatePort(this.props.node.getOutputs())}</div>
        </div>
      </div>
    );
  }
}