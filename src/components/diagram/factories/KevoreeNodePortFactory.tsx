import * as React from 'react';
import { AbstractPortFactory, DiagramEngine, DefaultPortWidget, DefaultLinkFactory } from '@leiko/react-diagrams';

import { KevoreeNodePortModel } from '../models';

export class KevoreeNodePortFactory extends AbstractPortFactory {

  constructor() {
    super('kevoree-node-port');
  }

  generateReactWidget(engine: DiagramEngine, port: KevoreeNodePortModel) {
    return <DefaultPortWidget engine={engine} port={port} />;
  }

  getNewInstance(initConfig?: any) {
    return new KevoreeNodePortModel(initConfig.isInput);
  }

  getLinkFactory() {
    return new DefaultLinkFactory();
  }
}