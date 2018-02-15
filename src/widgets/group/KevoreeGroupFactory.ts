
import * as React from 'react';
import { NodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeGroupModel } from './KevoreeGroupModel';
import { KevoreeGroupWidget } from './KevoreeGroupWidget';

export class KevoreeGroupFactory extends NodeFactory {

  constructor() {
    super('kevoree-group');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeGroupModel): JSX.Element {
    return React.createElement(KevoreeGroupWidget, { node, diagramEngine });
  }

  getNewInstance() {
    return new KevoreeGroupModel();
  }
}