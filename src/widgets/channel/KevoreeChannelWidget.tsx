import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import * as cx from 'classnames';

import { KevoreeChannelModel } from './KevoreeChannelModel';
import { KevoreeEngine } from '../../KevoreeEngine';

import './KevoreeChannelWidget.css';

export interface KevoreeChannelWidgetProps {
  node: KevoreeChannelModel;
  diagramEngine: DiagramEngine;
  kevoreeEngine: KevoreeEngine;
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
      </div>
    );
  }
}