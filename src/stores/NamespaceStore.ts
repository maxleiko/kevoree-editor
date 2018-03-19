import { observable, computed, action } from 'mobx';
import { ITypeDefinition, INamespace } from 'kevoree-registry-client';

import { RegistryService } from '../services/RegistryService';
import { SidebarStore } from './SidebarStore';
import { inferType } from '../utils/kevoree';
import { KEVOREE_CHANNEL, KEVOREE_COMPONENT, KEVOREE_GROUP, KEVOREE_NODE } from '../utils/constants';

export class NamespaceStore {

  private _namespace: INamespace;
  private _sidebarStore: SidebarStore;
  private _registryService: RegistryService;

  @observable private _isOpen: boolean;
  @observable private _tdefs: ITypeDefinition[] = [];
  @observable private _error: any = null;

  constructor(namespace: INamespace, sidebarStore: SidebarStore, registryService: RegistryService,
              isOpen: boolean = false) {
    this._namespace = namespace;
    this._sidebarStore = sidebarStore;
    this._registryService = registryService;
    this._isOpen = isOpen;
  }

  @action fetchTdefs() {
    return this._registryService.tdefs(this._namespace.name)
      .then(this.fetchTdefsSuccess, this.fetchError);
  }

  @action.bound fetchTdefsSuccess(tdefs: ITypeDefinition[]) {
    this._tdefs.push(...tdefs);
  }

  @action.bound fetchError(err: any) {
    this._error = err;
  }

  @action.bound toggle() {
    this._isOpen = !this._isOpen;
  }

  @computed get tdefs() {
    return this._tdefs;
  }

  @computed get filteredTdefs() {
    return this._tdefs
    .filter((tdef) => {
      switch (inferType(tdef)) {
        case KEVOREE_CHANNEL:
          return this._sidebarStore.chanFilter;
        case KEVOREE_COMPONENT:
          return this._sidebarStore.compFilter;
        case KEVOREE_GROUP:
          return this._sidebarStore.groupFilter;
        case KEVOREE_NODE:
          return this._sidebarStore.nodeFilter;
        default:
          throw new Error(`Unable to infer Kevoree type for "${tdef.namespace!}.${tdef.name}/${tdef.version}"`);
      }
    })
    .filter((tdef) => tdef.name.toLowerCase().indexOf(this._sidebarStore.nameFilter) > -1)
    .sort((t0, t1) => {
      if (t0.name > t1.name) { return 1; }
      if (t1.name > t0.name) { return -1; }
      return 0;
    });
  }

  @computed get isOpen() {
    return this._isOpen;
  }

  @computed get namespace() {
    return this._namespace;
  }

  @computed get error() {
    return this._error;
  }
}