import { ITypeDefinition } from 'kevoree-registry-client';
import { observable, computed, action } from 'mobx';

import { RegistryService } from '../services';
import * as kUtils from '../utils/kevoree';

export class RegistryStore {

  private _registryService: RegistryService;

  @observable private _nameFilter = '';
  @observable private _tdefs: ITypeDefinition[] = [];

  constructor(_registryService: RegistryService) {
    this._registryService = _registryService;
  }

  @action fetchAll() {
    return this._registryService.latestTdefs()
      .then(this.fetchTypeDefinitionsSuccess);
  }

  @action.bound fetchTypeDefinitionsSuccess(tdefs: ITypeDefinition[]) {
    this._tdefs = tdefs;
  }

  @action onChangeNameFilter(event: React.ChangeEvent<HTMLInputElement>) {
    this._nameFilter = event.target.value.toLowerCase();
  }

  @computed get nameFilter() {
    return this._nameFilter;
  }

  @computed get nodes(): ITypeDefinition[] {
    return this._tdefs
      .filter((tdef) => kUtils.inferType(tdef) === 'node')
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }

  @computed get components(): ITypeDefinition[] {
    return this._tdefs
      .filter((tdef) => kUtils.inferType(tdef) === 'component')
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }

  @computed get channels(): ITypeDefinition[] {
    return this._tdefs
      .filter((tdef) => kUtils.inferType(tdef) === 'channel')
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }

  @computed get groups(): ITypeDefinition[] {
    return this._tdefs
      .filter((tdef) => kUtils.inferType(tdef) === 'group')
      .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
      .sort((tdef0, tdef1) => {
        if (tdef0.name > tdef1.name) { return 1; }
        if (tdef1.name > tdef0.name) { return -1; }
        return 0;
      });
  }
}