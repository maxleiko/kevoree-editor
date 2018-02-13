import { NodeModel } from 'storm-react-diagrams';
import * as ColorHash from 'color-hash';

export class KevoreeNodeModel extends NodeModel {

  name: string;
  typeName: string;
  color: string;
  width: number;
  height: number;

  constructor(instance?: k.Node, count: number = 0) {
    super('kevoree-node');
    if (instance) {
      this.name = `node${count}`;
      this.typeName = instance.typeDefinition.name;
      this.color = new ColorHash().hex(instance.typeDefinition.name);
    }
  }

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  serialize() {
    return {
      ...super.serialize(),
      name: this.name,
      typeName: this.typeName,
      width: this.width,
      height: this.height,
      color: this.color,
    };
  }

  deSerialize(obj: any) {
    super.deSerialize(obj);
    this.name = obj.name;
    this.typeName = obj.typeName;
    this.color = obj.color;
    this.width = obj.width;
    this.height = obj.height;
  }
}