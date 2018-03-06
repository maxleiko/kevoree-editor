import * as kevoree from 'kevoree-library';

import { AbstractModel } from './AbstractModel';
import { KevoreeComponentModel } from './KevoreeComponentModel';

export class KevoreeNodeModel extends AbstractModel<kevoree.Node> {

  components: KevoreeComponentModel[] = [];

  constructor(instance?: kevoree.Node) {
    super('kevoree-node', instance);
    if (instance) {
      this.instance = instance;
    }
  }

  addComponent(comp: KevoreeComponentModel) {
    this.components.push(comp);
  }
}