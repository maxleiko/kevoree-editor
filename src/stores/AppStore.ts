import { action } from 'mobx';

export class AppStore {

  @action
  undo() {
    throw new Error('not implemented yet');
  }

  @action
  redo() {
    throw new Error('not implemented yet');
  }
}