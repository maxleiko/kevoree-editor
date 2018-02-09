
import * as React from 'react';
import { DiagramEngine, NodeFactory } from 'storm-react-diagrams';

import { KevoreeComponentModel } from './KevoreeComponentModel';
import { KevoreeComponentWidget } from './KevoreeComponentWidget';

export class KevoreeComponentFactory extends NodeFactory {

  constructor() {
    super('kevoree-component');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeComponentModel): JSX.Element {
    return React.createElement(KevoreeComponentWidget, { node, diagramEngine });
  }

  getNewInstance() {
    return new KevoreeComponentModel();
  }
}