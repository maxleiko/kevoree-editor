import { DefaultLinkModel, PointModel } from '@leiko/react-diagrams';
import { computed, reaction, observable, observe, IObservableArray } from 'mobx';
import { Binding, DefaultKevoreeFactory } from 'kevoree-ts-model';
import { KWE_SELECTED, KWE_BINDING_POINTS } from '../../../utils/constants';

export class KevoreeLinkModel extends DefaultLinkModel {

  @observable private _binding: Binding | null = null;
  private _reactionDisposers: Array<() => void> = [];

  constructor(color?: string, width?: number, curvyness?: number) {
    super(color, width, curvyness);

    this.addReaction(
      reaction(() => this.selected, (selected) => {
        if (this._binding) {
          let meta = this._binding.getMeta(KWE_SELECTED);
          if (!meta) {
            meta = new DefaultKevoreeFactory().createValue<any>().withName(KWE_SELECTED);
            this._binding.addMeta(meta);
          }
          meta.value = selected + '';
        }
      })
    );

    this.addReaction(
      observe(this.points as IObservableArray, (change) => {
        // tslint:disable-next-line
        console.log('observe', change);
        if (change.type === 'splice') {
          this.updateKevoreePoint(change.object);
        }
      })
    );
  }

  @computed
  get binding(): Binding | null {
    return this._binding;
  }

  set binding(binding: Binding | null) {
    this._binding = binding;
  }

  protected addReaction(disposer: () => void) {
    this._reactionDisposers.push(disposer);
  }

  private updateKevoreePoint(points: PointModel[]) {
    if (this._binding) {
      let meta = this._binding.getMeta(KWE_BINDING_POINTS);
      if (!meta) {
        meta = new DefaultKevoreeFactory().createValue<any>().withName(KWE_BINDING_POINTS);
        this._binding.addMeta(meta);
      }
      meta.value = JSON.stringify(points.map((pt) => pt.toJSON()));
    }
  }
}