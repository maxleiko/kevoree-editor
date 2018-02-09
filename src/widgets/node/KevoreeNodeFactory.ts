
import * as React from 'react';
import { NodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeNodeModel } from './KevoreeNodeModel';
import { KevoreeNodeWidget } from './KevoreeNodeWidget';
import { KevoreeEngine } from '../../KevoreeEngine';

export class KevoreeNodeFactory extends NodeFactory {

  private kevoreeEngine: KevoreeEngine;

  constructor(kevoreeEngine: KevoreeEngine) {
    super('kevoree-node');
    this.kevoreeEngine = kevoreeEngine;
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeNodeModel): JSX.Element {
    return React.createElement(KevoreeNodeWidget, { node, diagramEngine, kevoreeEngine: this.kevoreeEngine });
  }

  getNewInstance() {
    return new KevoreeNodeModel();
  }
}