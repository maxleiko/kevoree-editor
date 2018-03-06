import * as React from 'react';
import { PortWidget } from 'storm-react-diagrams';

import { KevoreePortModel } from '../models/KevoreePortModel';

import './KevoreePortWidget.scss';

export interface KevoreePortWidgetProps {
  model: KevoreePortModel;
}

export class KevoreePortWidget extends React.Component<KevoreePortWidgetProps> {

  render() {
    const port = <PortWidget node={this.props.model.getParent()} name={this.props.model.name} />;
    const label = <span className="name">{this.props.model.port.name}</span>;

    return (
      <div className="kevoree-port">
        {this.props.model.isInput ? port : label}
        {this.props.model.isInput ? label : port}
      </div>
    );
  }
}