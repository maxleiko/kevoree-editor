import * as kevoree from 'kevoree-library';
import { observable, computed, action, createTransformer, ITransformer } from 'mobx';

import { isComponentType, isChannelType, isNodeType, isGroupType } from '../utils/kevoree';

export class SidebarStore {

  @observable private _nameFilter = '';
  @observable private _nodeFilter = true;
  @observable private _compFilter = true;
  @observable private _chanFilter = true;
  @observable private _groupFilter = true;

  filteredTdefs: ITransformer<kevoree.TypeDefinition[], kevoree.TypeDefinition[]>; 

  constructor() {
    this.filteredTdefs = createTransformer((tdefs: kevoree.TypeDefinition[]) => {
      return tdefs
        .filter((tdef) => {
          if (isNodeType(tdef)) {
            return this._nodeFilter;
          } else if (isComponentType(tdef)) {
            return this._compFilter;
          } else if (isChannelType(tdef)) {
            return this._chanFilter;
          } else if (isGroupType(tdef)) {
            return this._groupFilter;
          }
          return true;
        })
        .filter((tdef) => tdef.name.toLowerCase().indexOf(this._nameFilter) > -1)
        .sort((t0, t1) => {
          if (t0.name > t1.name) { return 1; }
          if (t1.name > t0.name) { return -1; }
          return 0;
        });
    });
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
}