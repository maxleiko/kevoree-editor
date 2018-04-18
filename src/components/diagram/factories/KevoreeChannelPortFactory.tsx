import * as React from 'react';
import { AbstractPortFactory, DiagramEngine, DefaultPortWidget, DefaultLinkFactory } from '@leiko/react-diagrams';

import { KevoreeChannelPortModel } from '../models/KevoreeChannelPortModel';

export class KevoreeChannelPortFactory extends AbstractPortFactory {

  constructor() {
    super('kevoree-channel-port');
  }

  generateReactWidget(engine: DiagramEngine, port: KevoreeChannelPortModel) {
    return <DefaultPortWidget engine={engine} port={port} />;
  }

  getNewInstance(initConfig?: any) {
    return new KevoreeChannelPortModel(initConfig.isInput);
  }

  getLinkFactory() {
    return new DefaultLinkFactory();
  }
}