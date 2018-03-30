import * as _ from 'lodash';
import { Component, Port } from 'kevoree-ts-model';

import { AbstractModel } from './AbstractModel';
import { KevoreePortModel } from './KevoreePortModel';

export class KevoreeComponentModel extends AbstractModel<Component> {

  ports: { [s: string]: KevoreePortModel };

  constructor(instance: Component) {
    super('kevoree-component', instance);
    instance.inputs.forEach((port) => this.addInput(port));
    instance.outputs.forEach((port) => this.addOutput(port));
  }

  addInput(port: Port) {
    return this.addPort(new KevoreePortModel(true, port));
  }

  addOutput(port: Port) {
    return this.addPort(new KevoreePortModel(false, port));
  }

  getInputs() {
    return _.filter(this.ports, (portModel) => {
      return portModel.isInput;
    });
  }

  getOutputs() {
    return _.filter(this.ports, (portModel) => {
      return !portModel.isInput;
    });
  }
}