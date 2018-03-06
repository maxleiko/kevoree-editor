
import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeNodeModel } from '../models/KevoreeNodeModel';
import { KevoreeNodeWidget } from '../widgets/KevoreeNodeWidget';

export class KevoreeNodeFactory extends AbstractNodeFactory {

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