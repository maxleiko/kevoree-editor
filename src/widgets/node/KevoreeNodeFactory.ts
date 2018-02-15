
import * as React from 'react';
import { NodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeNodeModel } from './KevoreeNodeModel';
import { KevoreeNodeWidget } from './KevoreeNodeWidget';

export class KevoreeNodeFactory extends NodeFactory {

  constructor() {
    super('kevoree-node');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeNodeModel): JSX.Element {
    return React.createElement(KevoreeNodeWidget, { node, diagramEngine });
  }

  getNewInstance() {
    return new KevoreeNodeModel();
  }
}