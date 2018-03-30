import { Node, Group, Channel, Component } from 'kevoree-ts-model';
import { NodeModel, DiagramEngine } from 'storm-react-diagrams';
import { str2rgb } from '../../../utils/colors';
import * as kUtils from '../../../utils/kevoree';

type Instances = Node | Group | Channel | Component;

export abstract class AbstractModel<T extends Instances = Instances> extends NodeModel {

  instance: T;
  color: kwe.RGB;

  private _width: number;
  private _height: number;

  protected constructor(nodeType: string, instance: T) {
    super(nodeType, instance.path);
    this.instance = instance;
    this.color = str2rgb(instance.tdef!.name!);
    const { x, y } = kUtils.getPosition(instance);
    this.x = x;
    this.y = y;
    this.selected = kUtils.isSelected(instance);
  }

  setSelected(isSelected: boolean = true) {
    super.setSelected(isSelected);
    kUtils.setSelected(this.instance, isSelected);
  }

  serialize() {
    return {
      ...super.serialize(),
      instance: this.instance.path,
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

  set width(width: number) {
    this._width = width;
  }

  set height(height: number) {
    this._height = height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}