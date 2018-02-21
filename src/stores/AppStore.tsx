import * as React from 'react';
import { observable, action } from 'mobx';
import { toast } from 'react-toastify';

export class AppStore {

  @observable
  private _mode: kwe.Mode = 'model';

  @action
  changeMode() {
    this._mode = this._mode === 'model' ? 'node' : 'model';
  }

  @action
  undo() {
    toast.info(<span><strong>undo</strong> is not implemented yet</span>);
  }

  @action
  redo() {
    toast.info(<span><strong>redo</strong> is not implemented yet</span>);
  }

  get mode() {
    return this._mode;
  }
}