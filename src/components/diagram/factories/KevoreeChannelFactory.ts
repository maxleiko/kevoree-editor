
import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from 'storm-react-diagrams';

import { KevoreeChannelModel } from '../models/KevoreeChannelModel';
import { KevoreeChannelWidget } from '../widgets/KevoreeChannelWidget';

export class KevoreeChannelFactory extends AbstractNodeFactory {

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