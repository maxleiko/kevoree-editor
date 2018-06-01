import { observable } from 'mobx';

export class AppStore {
  @observable currentView: number = 0;
}