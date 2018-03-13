import { observable, computed, action } from 'mobx';

export class SelectionPanelStore {

  @observable private _width = 250;
  @observable private _minWidth = 250;

  @action.bound setWidth(width: number) {
    this._width = width;
  }

  @computed get width() {
    return this._width;
  }

  @computed get minWidth() {
    return this._minWidth;
  }
}