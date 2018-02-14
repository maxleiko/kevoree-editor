
import * as React from 'react';
import { NodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeGroupModel } from './KevoreeGroupModel';
import { KevoreeGroupWidget } from './KevoreeGroupWidget';
import { KevoreeEngine } from '../../KevoreeEngine';

export class KevoreeGroupFactory extends NodeFactory {

  private kevoreeEngine: KevoreeEngine;

  constructor(kevoreeEngine: KevoreeEngine) {
    super('kevoree-group');
    this.kevoreeEngine = kevoreeEngine;
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeGroupModel): JSX.Element {
    return React.createElement(KevoreeGroupWidget, { node, diagramEngine, kevoreeEngine: this.kevoreeEngine });
  }

  getNewInstance() {
    return new KevoreeGroupModel();
  }
}