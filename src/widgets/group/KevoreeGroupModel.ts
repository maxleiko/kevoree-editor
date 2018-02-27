import * as kevoree from 'kevoree-library';
import { DiagramEngine } from 'storm-react-diagrams';

import { AbstractModel } from '../AbstractModel';

export class KevoreeGroupModel extends AbstractModel<kevoree.Group> {

  constructor(instance?: kevoree.Group) {
    super('kevoree-group', instance, instance ? instance.typeDefinition.name : undefined);
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

  deSerialize(obj: any, engine: DiagramEngine) {
    super.deSerialize(obj, engine);
    this.instance = obj.instance;
  }
}