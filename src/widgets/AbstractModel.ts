import * as _ from 'lodash';
import { NodeModel, DefaultPortModel } from 'storm-react-diagrams';
import * as ColorHash from 'color-hash';

export abstract class AbstractModel extends NodeModel {
  width: number;
  height: number;
  color: string;
  ports: { [s: string]: DefaultPortModel };

  protected constructor(name: string, color: string = '#000') {
    super(name);
    this.color = new ColorHash().hex(color);
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
      width: this.width,
      height: this.height,
      color: this.color,
    };
  }

  deSerialize(obj: any) {
    super.deSerialize(obj);
    this.width = obj.width;
    this.height = obj.height;
    this.color = obj.color;
  }

  getInPorts() {
    return _.filter(this.ports, (portModel) => {
      return portModel.in;
    });
  }

  getOutPorts() {
    return _.filter(this.ports, (portModel) => {
      return !portModel.in;
    });
  }
}