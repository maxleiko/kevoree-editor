import { observable, computed, action } from 'mobx';
import { ITypeDefinition, INamespace } from 'kevoree-registry-client';

import { RegistryService } from '../services/RegistryService';
import { SidebarStore } from './SidebarStore';
import { inferType } from '../utils/kevoree';
import { KEVOREE_CHANNEL, KEVOREE_COMPONENT, KEVOREE_GROUP, KEVOREE_NODE } from '../utils/constants';

export class SidebarGroupStore {

  @observable private _tdefs: ITypeDefinition[] = [];
  @observable private _error: any = null;

  constructor(private sidebarStore: SidebarStore, public namespace: INamespace,
              private registryService: RegistryService) {}

  @action fetchTdefs() {
    return this.registryService.tdefs(this.namespace.name)
      .then(this.fetchTdefsSuccess, this.fetchError);
  }

  @action.bound fetchTdefsSuccess(tdefs: ITypeDefinition[]) {
    this._tdefs.push(...tdefs);
  }

  @action.bound fetchError(err: any) {
    this._error = err;
  }

  @computed get tdefs() {
    return this._tdefs;
  }

  @computed get filteredTdefs() {
    return this._tdefs
    .filter((tdef) => {
      switch (inferType(tdef)) {
        case KEVOREE_CHANNEL:
          return this.sidebarStore.chanFilter;
        case KEVOREE_COMPONENT:
          return this.sidebarStore.compFilter;
        case KEVOREE_GROUP:
          return this.sidebarStore.groupFilter;
        case KEVOREE_NODE:
          return this.sidebarStore.nodeFilter;
        default:
          throw new Error(`Unable to infer Kevoree type for "${tdef.namespace!}.${tdef.name}/${tdef.version}"`);
      }
    })
    .filter((tdef) => tdef.name.toLowerCase().indexOf(this.sidebarStore.nameFilter) > -1)
    .sort((t0, t1) => {
      if (t0.name > t1.name) { return 1; }
      if (t1.name > t0.name) { return -1; }
      return 0;
    });
  }

  @computed get error() {
    return this._error;
  }
}