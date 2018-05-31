import { DefaultLinkModel } from '@leiko/react-diagrams';
import { computed, IReactionDisposer, reaction, observable } from 'mobx';
import { Binding, DefaultKevoreeFactory } from 'kevoree-ts-model';
import { KWE_SELECTED } from '../../../utils/constants';

export class KevoreeLinkModel extends DefaultLinkModel {

  @observable private _binding: Binding | null = null;
  private _reactionDisposers: IReactionDisposer[] = [];

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
  }

  @computed
  get binding(): Binding | null {
    return this._binding;
  }

  set binding(binding: Binding | null) {
    this._binding = binding;
  }

  protected addReaction(disposer: IReactionDisposer) {
    this._reactionDisposers.push(disposer);
  }
}