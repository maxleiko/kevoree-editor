import { INamespace } from 'kevoree-registry-client';
import { observable, computed, action } from 'mobx';

import { SidebarGroupStore } from './SidebarGroupStore';
import { RegistryService } from '../services/RegistryService';

export class SidebarStore {

  @observable private _nameFilter = '';
  @observable private _nodeFilter = true;
  @observable private _compFilter = true;
  @observable private _chanFilter = true;
  @observable private _groupFilter = true;
  @observable private _namespaces: Map<string, SidebarGroupStore> = new Map();
  @observable private _error: any = null;

  constructor(private registryService: RegistryService) {}

  @action fetchNamespaces() {
    return this.registryService.namespaces()
      .then(this.fetchNamespacesSuccess, this.fetchError);
  }

  @action.bound fetchNamespacesSuccess(namespaces: INamespace[]) {
    namespaces.forEach((ns) => this.fetchNamespaceSuccess(ns));
  }

  @action fetchNamespace(name: string) {
    return this.registryService.namespace(name)
      .then(this.fetchNamespaceSuccess, this.fetchError);
  }

  @action.bound fetchNamespaceSuccess(namespace: INamespace) {
    this._namespaces.set(namespace.name, new SidebarGroupStore(this, namespace, this.registryService));
  }

  @action.bound fetchError(err: any) {
    this._error = err;
  }

  @action onChangeNameFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this._nameFilter = event.target.value.toLowerCase();
  }

  @action onChangeNodeFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this._nodeFilter = event.target.checked;
  }

  @action onChangeGroupFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this._groupFilter = event.target.checked;
  }

  @action onChangeChanFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this._chanFilter = event.target.checked;
  }

  @action onChangeCompFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this._compFilter = event.target.checked;
  }

  @computed get namespaces() {
    return Array.from(this._namespaces.values())
      .map((store) => store.namespace)
      .sort((ns0, ns1) => {
        if (ns0.name === 'kevoree') { return -1; }
        if (ns0.name > ns1.name) { return 1; }
        if (ns1.name > ns0.name) { return -1; }
        return 0;
      });
  }

  @computed get namespacesMap() {
    return this._namespaces;
  }

  @computed get nameFilter() {
    return this._nameFilter;
  }

  @computed get nodeFilter() {
    return this._nodeFilter;
  }

  @computed get compFilter() {
    return this._compFilter;
  }

  @computed get chanFilter() {
    return this._chanFilter;
  }

  @computed get groupFilter() {
    return this._groupFilter;
  }

  @computed get error() {
    return this._error;
  }
}