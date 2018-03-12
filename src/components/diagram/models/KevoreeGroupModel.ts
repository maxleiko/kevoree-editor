import * as kevoree from 'kevoree-library';

import { AbstractModel } from './AbstractModel';

export class KevoreeGroupModel extends AbstractModel<kevoree.Group> {

  constructor(instance: kevoree.Group) {
    super('kevoree-group', instance);
  }
}