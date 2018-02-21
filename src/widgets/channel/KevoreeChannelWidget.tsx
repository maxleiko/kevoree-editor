import * as React from 'react';
import { DiagramEngine, DefaultPortLabel, DefaultPortModel } from 'storm-react-diagrams';
import * as cx from 'classnames';

import { KevoreeChannelModel } from './KevoreeChannelModel';

import './KevoreeChannelWidget.css';

export interface KevoreeChannelWidgetProps {
  node: KevoreeChannelModel;
  diagramEngine: DiagramEngine;
}

interface KevoreeChannelWidgetState {}

export class KevoreeChannelWidget extends React.Component<KevoreeChannelWidgetProps, KevoreeChannelWidgetState> {

  private elem: HTMLDivElement;

  constructor(props: KevoreeChannelWidgetProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.node.setWidth(this.elem.getBoundingClientRect().width);
    this.props.node.setHeight(this.elem.getBoundingClientRect().height);
  }

  generatePort(port: DefaultPortModel) {
    return <DefaultPortLabel key={port.id} model={port} />;
  }

  render() {
    return (
      <div
        ref={(elem) => this.elem = elem!}
        className={cx('basic-node', 'kevoree-channel')}
        style={{ background: this.props.node.color }}
      >
        <div className="title">
          <div className="name">{this.props.node.instance.name}: {this.props.node.instance.typeDefinition.name}</div>
        </div>
        <div className="ports">
          <div className="in">{this.props.node.getInPorts().map((port) => this.generatePort(port))}</div>
          <div className="out">{this.props.node.getOutPorts().map((port) => this.generatePort(port))}</div>
        </div>
      </div>
    );
  }
}