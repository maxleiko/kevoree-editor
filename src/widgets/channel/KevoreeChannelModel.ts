import * as kevoree from 'kevoree-library';
import { DefaultPortModel } from 'storm-react-diagrams';

import { AbstractModel } from '../AbstractModel';

export class KevoreeChannelModel extends AbstractModel {

  instance: kevoree.Channel;

  constructor(instance?: kevoree.Channel) {
    super('kevoree-channel', instance ? instance.typeDefinition.name : undefined);
    if (instance) {
      this.instance = instance;
      this.addPort(new DefaultPortModel(true, 'inputs'));
      this.addPort(new DefaultPortModel(false, 'outputs'));
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