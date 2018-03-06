import * as kevoree from 'kevoree-library';

import { AbstractModel } from './AbstractModel';

export class KevoreeChannelModel extends AbstractModel<kevoree.Channel> {

  constructor(instance?: kevoree.Channel) {
    super('kevoree-channel', instance);
    if (instance) {
      this.instance = instance;
    }
  }
}