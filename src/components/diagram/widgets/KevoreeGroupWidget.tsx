import * as React from 'react';
import { observer } from 'mobx-react';
import { DiagramEngine } from 'storm-react-diagrams';

import { KevoreeGroupModel } from '../models/KevoreeGroupModel';
import { InstanceHeader } from '../../kevoree';

import './KevoreeGroupWidget.scss';

export interface KevoreeGroupWidgetProps {
  node: KevoreeGroupModel;
  diagramEngine: DiagramEngine;
}

interface KevoreeGroupWidgetState {}

@observer
export class KevoreeGroupWidget extends React.Component<KevoreeGroupWidgetProps, KevoreeGroupWidgetState> {

  private _elem: HTMLDivElement | null;

  constructor(props: KevoreeGroupWidgetProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this._elem) {
      this.props.node.width = this._elem.getBoundingClientRect().width;
      this.props.node.height = this._elem.getBoundingClientRect().height;
    }
  }

  render() {
    return (
      <div
        ref={(elem) => this._elem = elem}
        className="kevoree-group"
        style={{ background: this.props.node.color }}
      >
        <InstanceHeader instance={this.props.node.instance} hoverable={false} />
      </div>
    );
  }
}