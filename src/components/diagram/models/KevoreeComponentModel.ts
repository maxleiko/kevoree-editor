import { computed } from 'mobx';
import { Component } from 'kevoree-ts-model';

import { AbstractModel } from './AbstractModel';
import { KevoreePortModel } from './KevoreePortModel';

export class KevoreeComponentModel extends AbstractModel<Component, KevoreePortModel> {

  constructor(instance: Component) {
    super('kevoree-component', instance);
    instance.inputs.forEach((port) => this.addPort(new KevoreePortModel(true, port)));
    instance.outputs.forEach((port) => this.addPort(new KevoreePortModel(false, port)));
  }

  @computed
  get inputs() {
    return this.ports.filter((p) => p.in);
  }

  @computed
  get outputs() {
    return this.ports.filter((p) => !p.in);
  }
}