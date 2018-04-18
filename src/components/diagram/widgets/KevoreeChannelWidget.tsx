import * as React from 'react';
import { observer } from 'mobx-react';
import { DiagramEngine, DefaultPortWidget } from '@leiko/react-diagrams';

import { KevoreeChannelModel } from '../models/KevoreeChannelModel';
import { InstanceHeader } from '../../kevoree';

import './KevoreeChannelWidget.scss';
import { KevoreeChannelPortModel } from '../models/KevoreeChannelPortModel';

export interface KevoreeChannelWidgetProps {
  node: KevoreeChannelModel;
  engine: DiagramEngine;
}

interface PortProps {
  className: 'in' | 'out';
  engine: DiagramEngine;
  port: KevoreeChannelPortModel;
}

const Port = observer(({ className, engine, port }: PortProps) => (
  <div className={className}>
    <DefaultPortWidget engine={engine} port={port} />
  </div>
));

@observer
export class KevoreeChannelWidget extends React.Component<KevoreeChannelWidgetProps> {

  private _elem: HTMLDivElement | null;

  componentDidMount() {
    if (this._elem) {
      this.props.node.width = this._elem.getBoundingClientRect().width;
      this.props.node.height = this._elem.getBoundingClientRect().height;
    }
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
          <Port className="in" engine={this.props.engine} port={this.props.node.input} />
          <Port className="out" engine={this.props.engine} port={this.props.node.output} />
        </div>
      </div>
    );
  }
}