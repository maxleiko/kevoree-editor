
import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from 'storm-react-diagrams';
import { KevoreeGroupModel } from '../models/KevoreeGroupModel';
import { KevoreeGroupWidget } from '../widgets/KevoreeGroupWidget';

export class KevoreeGroupFactory extends AbstractNodeFactory {

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