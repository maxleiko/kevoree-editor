import { Node } from 'kevoree-ts-model';

import { AbstractModel } from './AbstractModel';
import { KevoreeNodePortModel } from '.';

export class KevoreeNodeModel extends AbstractModel<Node> {

  constructor(instance: Node) {
    super('kevoree-node', instance);
    this.addPort(new KevoreeNodePortModel(true));
    this.addPort(new KevoreeNodePortModel(false));
  }
}