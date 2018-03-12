import * as kevoree from 'kevoree-library';

import { AbstractModel } from './AbstractModel';

export class KevoreeNodeModel extends AbstractModel<kevoree.Node> {

  constructor(instance: kevoree.Node) {
    super('kevoree-node', instance);
  }
}