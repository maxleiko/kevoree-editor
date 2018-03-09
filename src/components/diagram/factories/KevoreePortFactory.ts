import { AbstractPortFactory } from 'storm-react-diagrams';

import { KevoreePortModel } from '../models/KevoreePortModel';

export class KevoreePortFactory extends AbstractPortFactory {

  constructor() {
    super('kevoree-port');
  }

  getNewInstance(initConfig?: any) {
    return new KevoreePortModel(initConfig.isInput, initConfig.port);
  }
}