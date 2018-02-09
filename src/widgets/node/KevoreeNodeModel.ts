import { NodeModel } from 'storm-react-diagrams';
import * as ColorHash from 'color-hash';

import { TypeDefinition } from '../../types/kevoree';
import { KevoreeComponentModel } from '../component/index';

export class KevoreeNodeModel extends NodeModel {

  name: string;
  color: string;
  components: KevoreeComponentModel[] = [];

  constructor(tdef: TypeDefinition | undefined = undefined, count: number = 0) {
    super('kevoree-node');
    if (tdef) {
      this.name = `node${count}: ${tdef.name}`;
      this.color = new ColorHash().hex(tdef.name);
    }
  }

  addComponent(comp: KevoreeComponentModel) {
    this.components.push(comp);
  }

  serialize() {
    return {
      ...super.serialize(),
      name: this.name,
      color: this.color,
      components: this.components.map((comp) => comp.serialize())
    };
  }

  deSerialize(obj: { name: string, color: string }) {
    super.deSerialize(obj);
    this.name = obj.name;
    this.color = obj.color;
  }
}