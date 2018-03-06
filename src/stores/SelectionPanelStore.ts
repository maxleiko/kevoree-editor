import { observable, computed, action } from 'mobx';
import * as kevoree from 'kevoree-library';

import { AbstractModel } from '../components/diagram/models/AbstractModel';

export class SelectionPanelStore {

  @observable private _width = 250;
  @observable private _minWidth = 250;
  @observable private _selection: AbstractModel<kevoree.Instance>[] = [];

  @action setWidth(width: number) {
    this._width = width;
  }

  @action setSelection(selection: AbstractModel<kevoree.Instance>[]) {
    this._selection = selection;
  }

  @action clear() {
    this._selection = [];
  }

  @computed get width() {
    return this._width;
  }

  @computed get minWidth() {
    return this._minWidth;
  }

  @computed get selection() {
    return this._selection;
  }

  @computed get isOpen() {
    return this._selection.length > 0;
  }
}