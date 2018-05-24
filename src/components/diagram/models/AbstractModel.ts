import { reaction, IReactionDisposer } from 'mobx';
import { Node, Group, Channel, Component, DefaultKevoreeFactory } from 'kevoree-ts-model';
import { ANodeModel, DiagramEngine, PortModel } from '@leiko/react-diagrams';

import { str2rgb } from '../../../utils/colors';
import * as kUtils from '../../../utils/kevoree';
import { KWE_SELECTED, KWE_POSITION } from '../../../utils/constants';

type Instance = Node | Group | Channel | Component;

export abstract class AbstractModel<
  T extends Instance = Instance,
  P extends PortModel = PortModel
> extends ANodeModel<P> {

  instance: T;
  color: kwe.RGB;
  private _reactionDisposers: IReactionDisposer[] = [];

  protected constructor(nodeType: string, instance: T) {
    super(nodeType, instance.path);
    this.instance = instance;
    this.color = str2rgb(instance.tdef!.name!);
    const { x, y } = kUtils.getPosition(instance);
    this.setPosition(x, y);
    this.selected = kUtils.isSelected(instance);

    this.addReaction(
      reaction(() => this.selected, (selected) => {
        let meta = instance.getMeta(KWE_SELECTED);
        if (!meta) {
          meta = new DefaultKevoreeFactory().createValue<any>().withName(KWE_SELECTED);
          (instance as any).addMeta(meta);
        }
        meta.value = selected + '';
      })
    );

    this.addReaction(
      reaction(() => ({ x: this.x, y: this.y }), (position) => {
        let meta = instance.getMeta(KWE_POSITION);
        if (!meta) {
          meta = new DefaultKevoreeFactory().createValue<any>().withName(KWE_POSITION);
          (instance as any).addMeta(meta);
        }
        meta.value = JSON.stringify(position);
      })
    );

    // automatically delete Kevoree instance when UI node is deleted
    this.addReaction(
      reaction(() => instance.deleting, (deleting) => {
        this.delete();
      })
    );
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

  delete() {
    super.delete();
    this.instance.delete();
    this._reactionDisposers.forEach((disposer) => disposer());
  }

  addReaction(disposer: IReactionDisposer) {
    this._reactionDisposers.push(disposer);
  }
}