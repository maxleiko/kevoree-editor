import { Node, Group, Channel, Component } from 'kevoree-ts-model';
import { NodeModel, DiagramEngine, PortModel } from '@leiko/react-diagrams';
import { str2rgb } from '../../../utils/colors';
import * as kUtils from '../../../utils/kevoree';

type Instances = Node | Group | Channel | Component;

export abstract class AbstractModel<
  T extends Instances = Instances,
  P extends PortModel = PortModel
> extends NodeModel<P> {

  instance: T;
  color: kwe.RGB;

  protected constructor(nodeType: string, instance: T) {
    super(nodeType, instance.path);
    this.instance = instance;
    this.color = str2rgb(instance.tdef!.name!);
    const { x, y } = kUtils.getPosition(instance);
    this.x = x;
    this.y = y;
    this.selected = kUtils.isSelected(instance);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      instance: this.instance.path,
      width: this.width,
      height: this.height,
      color: this.color,
    };
  }

  fromJSON(obj: any, engine: DiagramEngine) {
    super.fromJSON(obj, engine);
    this.width = obj.width;
    this.height = obj.height;
    this.color = obj.color;
  }
}