import * as kevoree from 'kevoree-library';

import { AbstractModel } from '../AbstractModel';

export class KevoreeGroupModel extends AbstractModel {

  instance: kevoree.Group;

  constructor(instance?: kevoree.Group) {
    super('kevoree-group', instance ? instance.typeDefinition.name : undefined);
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