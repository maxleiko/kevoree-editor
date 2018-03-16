import { observable, computed, action } from 'mobx';

export class SelectionPanelStore {

  private static WIDTH = 280;

  @observable private _width = SelectionPanelStore.WIDTH;
  @observable private _minWidth = SelectionPanelStore.WIDTH;

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