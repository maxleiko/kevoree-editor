import { observable, computed, action } from 'mobx';

import { KevoreeStore } from './KevoreeStore';
import { isComponentType, isChannelType, isNodeType, isGroupType } from '../utils/kevoree';

export class SidebarStore {

  private kevoreeStore: KevoreeStore;

  @observable nameFilter = '';
  @observable nodeFilter = true;
  @observable compFilter = true;
  @observable chanFilter = true;
  @observable groupFilter = true;

  constructor(kevoreeStore: KevoreeStore) {
    this.kevoreeStore = kevoreeStore;
  }

  @computed get filtered() {
    return this.kevoreeStore.typeDefinitions
      .filter((tdef) => {
        if (isNodeType(tdef)) {
          return this.nodeFilter;
        } else if (isComponentType(tdef)) {
          return this.compFilter;
        } else if (isChannelType(tdef)) {
          return this.chanFilter;
        } else if (isGroupType(tdef)) {
          return this.groupFilter;
        }
        return true;
      })
      .filter((tdef) => {
        return tdef.name.toLowerCase().indexOf(this.nameFilter) > -1;
      });
  }

  @action onChangeNameFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this.nameFilter = event.target.value.toLowerCase();
  }

  @action onChangeNodeFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this.nodeFilter = event.target.checked;
  }

  @action onChangeGroupFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this.groupFilter = event.target.checked;
  }

  @action onChangeChanFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this.chanFilter = event.target.checked;
  }

  @action onChangeCompFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this.compFilter = event.target.checked;
  }
}