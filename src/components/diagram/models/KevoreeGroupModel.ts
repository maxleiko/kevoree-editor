import { Group } from 'kevoree-ts-model';

import { AbstractModel } from './AbstractModel';

export class KevoreeGroupModel extends AbstractModel<Group> {

  constructor(instance: Group) {
    super('kevoree-group', instance);
  }
}