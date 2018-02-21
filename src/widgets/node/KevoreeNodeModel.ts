import * as kevoree from 'kevoree-library';

import { AbstractModel } from '../AbstractModel';
import { KevoreeComponentModel } from '../component';

export class KevoreeNodeModel extends AbstractModel {

  instance: kevoree.Node;
  components: KevoreeComponentModel[] = [];

  constructor(instance?: kevoree.Node) {
    super('kevoree-node', instance ? instance.typeDefinition.name : undefined);
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

  addComponent(comp: KevoreeComponentModel) {
    this.components.push(comp);
  }
}