import * as React from 'react';
import { DiagramEngine, DefaultPortLabel, DefaultPortModel } from 'storm-react-diagrams';

import { KevoreeChannelModel } from '../models/KevoreeChannelModel';
import { InstanceHeader } from '../../kevoree';

import './KevoreeChannelWidget.scss';

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

  generatePort(port: DefaultPortModel) {
    return <DefaultPortLabel key={port.id} model={port} />;
  }

  render() {
    return (
      <div
        ref={(elem) => this._elem = elem}
        className="kevoree-channel"
        style={{ background: this.props.node.color }}
      >
        <InstanceHeader instance={this.props.node.instance} hoverable={false} />
      </div>
    );
  }
}