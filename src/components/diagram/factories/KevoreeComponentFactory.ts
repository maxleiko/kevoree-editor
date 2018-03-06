
import * as React from 'react';
import { DiagramEngine, AbstractNodeFactory } from 'storm-react-diagrams';

import { KevoreeComponentModel } from '../models/KevoreeComponentModel';
import { KevoreeComponentWidget } from '../widgets/KevoreeComponentWidget';

export class KevoreeComponentFactory extends AbstractNodeFactory {

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