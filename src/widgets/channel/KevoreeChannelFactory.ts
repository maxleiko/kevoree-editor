
import * as React from 'react';
import { NodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeChannelModel } from './KevoreeChannelModel';
import { KevoreeChannelWidget } from './KevoreeChannelWidget';

export class KevoreeChannelFactory extends NodeFactory {

  constructor() {
    super('kevoree-channel');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeChannelModel): JSX.Element {
    return React.createElement(KevoreeChannelWidget, { node, diagramEngine });
  }

  getNewInstance() {
    return new KevoreeChannelModel();
  }
}