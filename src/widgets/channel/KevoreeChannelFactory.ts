
import * as React from 'react';
import { NodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeChannelModel } from './KevoreeChannelModel';
import { KevoreeChannelWidget } from './KevoreeChannelWidget';
import { KevoreeEngine } from '../../KevoreeEngine';

export class KevoreeChannelFactory extends NodeFactory {

  private kevoreeEngine: KevoreeEngine;

  constructor(kevoreeEngine: KevoreeEngine) {
    super('kevoree-channel');
    this.kevoreeEngine = kevoreeEngine;
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeChannelModel): JSX.Element {
    return React.createElement(KevoreeChannelWidget, { node, diagramEngine, kevoreeEngine: this.kevoreeEngine });
  }

  getNewInstance() {
    return new KevoreeChannelModel();
  }
}