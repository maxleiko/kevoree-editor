import * as kevoree from 'kevoree-library';
import { NodeModel, DiagramEngine } from 'storm-react-diagrams';
import { KWE_POSITION } from '../../../utils/constants';
import { str2rgb } from '../../../utils/colors';
import * as kUtils from '../../../utils/kevoree';

export abstract class AbstractModel<T extends kevoree.Instance> extends NodeModel {

  instance: T | null;
  color: kwe.RGB;

  private _width: number;
  private _height: number;

  protected constructor(nodeType: string, instance: T | undefined) {
    super(nodeType);
    if (instance) {
      this.color = str2rgb(instance.typeDefinition.name);
      const { x, y } = kUtils.getPosition(instance);
      this.setPosition(x, y);
      this.setSelected(kUtils.isSelected(instance));
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

  serialize() {
    return {
      ...super.serialize(),
      instance: this.instance!.path(),
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