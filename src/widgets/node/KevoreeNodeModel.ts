import { DiagramEngine } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';

import { AbstractModel } from '../AbstractModel';
import { KevoreeComponentModel } from '../component';

export class KevoreeNodeModel extends AbstractModel<kevoree.Node> {

  components: KevoreeComponentModel[] = [];

  constructor(instance?: kevoree.Node) {
    super('kevoree-node', instance, instance ? instance.typeDefinition.name : undefined);
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

  addComponent(comp: KevoreeComponentModel) {
    this.components.push(comp);
  }
}