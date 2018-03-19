import { AbstractPortFactory } from 'storm-react-diagrams';

import { KevoreeChannelPortModel } from '../models/KevoreeChannelPortModel';

export class KevoreeChannelPortFactory extends AbstractPortFactory {

  constructor() {
    super('kevoree-channel-port');
  }

  getNewInstance(initConfig?: any) {
    return new KevoreeChannelPortModel(initConfig.isInput);
  }
}