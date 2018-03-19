import { ITypeDefinition } from 'kevoree-registry-client';
import { observable, computed, action } from 'mobx';

import { RegistryService } from '../services/RegistryService';
import * as kUtils from '../utils/kevoree';

export class SidebarStore {

  @observable private _nameFilter = '';
  @observable private _error: any = null;

  @observable private _nodes: Map<string, ITypeDefinition> = new Map();
  @observable private _components: Map<string, ITypeDefinition> = new Map();
  @observable private _channels: Map<string, ITypeDefinition> = new Map();
  @observable private _groups: Map<string, ITypeDefinition> = new Map();

  constructor(private _registryService: RegistryService) {}

  @action fetchAll() {
    return this._registryService.allTdefs()
      .then(this.fetchTypeDefinitionsSuccess, this.fetchError);
  }

  @action.bound fetchTypeDefinitionsSuccess(tdefs: ITypeDefinition[]) {
    tdefs.forEach((tdef) => {
      const key = `${tdef.namespace!}.${tdef.name}/${tdef.version}`;

      switch (kUtils.inferType(tdef)) {
        case 'node':
          this._nodes.set(key, tdef);
          break;

        case 'component':
          this._components.set(key, tdef);
          break;

        case 'channel':
          this._channels.set(key, tdef);
          break;

        case 'group':
          this._groups.set(key, tdef);
          break;

        default:
          break;
      }
    });
  }

  @action.bound fetchError(err: any) {
    this._error = err;
  }

  @action onChangeNameFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this._nameFilter = event.target.value.toLowerCase();
  }

  @computed get nameFilter() {
    return this._nameFilter;
  }

  @computed get nodes(): ITypeDefinition[] {
    return Array.from(this._nodes.values())
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }

  @computed get components(): ITypeDefinition[] {
    return Array.from(this._components.values())
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }

  @computed get channels(): ITypeDefinition[] {
    return Array.from(this._channels.values())
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }

  @computed get groups(): ITypeDefinition[] {
    return Array.from(this._groups.values())
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }

  @computed get error() {
    return this._error;
  }
}