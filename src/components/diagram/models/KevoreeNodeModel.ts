import { Node } from 'kevoree-ts-model';

import { AbstractModel } from './AbstractModel';

export class KevoreeNodeModel extends AbstractModel<Node> {

  constructor(instance: Node) {
    super('kevoree-node', instance);
  }
}