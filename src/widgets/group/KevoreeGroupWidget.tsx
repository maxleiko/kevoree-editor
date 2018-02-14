import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import * as cx from 'classnames';

import { KevoreeGroupModel } from './KevoreeGroupModel';
import { KevoreeEngine } from '../../KevoreeEngine';

import './KevoreeGroupWidget.css';

export interface KevoreeGroupWidgetProps {
  node: KevoreeGroupModel;
  diagramEngine: DiagramEngine;
  kevoreeEngine: KevoreeEngine;
}

interface KevoreeGroupWidgetState {}

export class KevoreeGroupWidget extends React.Component<KevoreeGroupWidgetProps, KevoreeGroupWidgetState> {

  private elem: HTMLDivElement;

  constructor(props: KevoreeGroupWidgetProps) {
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
        className={cx('basic-node', 'kevoree-group')}
        style={{ background: this.props.node.color }}
      >
        <div className="title">
          <div className="name">{this.props.node.instance.name}: {this.props.node.instance.typeDefinition.name}</div>
        </div>
      </div>
    );
  }
}