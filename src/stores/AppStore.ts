import { observable, action } from 'mobx';

export type Mode = 'model' | 'node';

export class AppStore {
  @observable
  private _mode: Mode = 'model';

  @action
  changeMode() {
    this._mode = this._mode === 'model' ? 'node' : 'model';
  }

  get mode() {
    return this._mode;
  }
}