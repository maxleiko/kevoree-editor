import * as kevoree from 'kevoree-library';

import { AbstractModel } from '../AbstractModel';

export class KevoreeChannelModel extends AbstractModel {

  instance: kevoree.Channel;

  constructor(instance?: kevoree.Channel) {
    super('kevoree-channel', instance ? instance.typeDefinition.name : undefined);
    if (instance) {
      this.instance = instance;
    }
  }

  serialize() {
    return {
      ...super.serialize(),
      instance: this.instance,
    };
  }

  deSerialize(obj: any) {
    super.deSerialize(obj);
    this.instance = obj.instance;
  }
}