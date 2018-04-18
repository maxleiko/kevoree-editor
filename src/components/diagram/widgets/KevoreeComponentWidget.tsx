import * as React from 'react';
import { observer } from 'mobx-react';
import { DiagramEngine, DefaultPortWidget, DefaultPortModel } from '@leiko/react-diagrams';
import { KevoreeComponentModel } from '../models/KevoreeComponentModel';

import { InstanceHeader } from '../../kevoree';

import './KevoreeComponentWidget.scss';

export interface KevoreeComponentWidgetProps {
  node: KevoreeComponentModel;
  engine: DiagramEngine;
}

interface PortProps {
  className: 'in' | 'out';
  engine: DiagramEngine;
  ports: DefaultPortModel[];
}

const Ports = observer(({ className, engine, ports }: PortProps) => (
  <div className={className}>
    {ports.map((port) => <DefaultPortWidget key={port.id} engine={engine} port={port} />)}
  </div>
));

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
          <Ports className="in" engine={this.props.engine} ports={this.props.node.inputs} />
          <Ports className="out" engine={this.props.engine} ports={this.props.node.outputs} />
        </div>
      </div>
    );
  }
}