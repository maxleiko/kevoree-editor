import * as _ from 'lodash';
import * as kevoree from 'kevoree-library';
import { NodeModel, DefaultPortModel, DiagramEngine } from 'storm-react-diagrams';
import * as ColorHash from 'color-hash';
import { KWE_POSITION } from '../utils/constants';

export abstract class AbstractModel<T extends kevoree.Instance> extends NodeModel {

  instance: T | null;
  width: number;
  height: number;
  color: string;
  ports: { [s: string]: DefaultPortModel };

  protected constructor(nodeType: string, instance: T | undefined, color: string = '#000') {
    super(nodeType);
    this.color = new ColorHash().hex(color);
    if (instance) {
      const position = instance.findMetaDataByID(KWE_POSITION);
      if (position) {
        const point: kwe.Point = JSON.parse(position.value);
        this.setPosition(point.x, point.y);
      }
    }
  }

  setPosition(x: number, y: number) {
    super.setPosition(x, y);
    if (this.instance) {
      let position: kevoree.Value<kevoree.Instance> | null = this.instance.findMetaDataByID(KWE_POSITION);
      if (!position) {
        const factory = new kevoree.factory.DefaultKevoreeFactory();
        position = factory.createValue<kevoree.Instance>().withName(KWE_POSITION);
        this.instance.addMetaData(position);
      }
      position.value = JSON.stringify({ x, y });
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
      width: this.width,
      height: this.height,
      color: this.color,
    };
  }

  deSerialize(obj: any, engine: DiagramEngine) {
    super.deSerialize(obj, engine);
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