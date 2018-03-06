import * as _ from 'lodash';
import * as kevoree from 'kevoree-library';

import { AbstractModel } from './AbstractModel';
import { KevoreePortModel } from './KevoreePortModel';

export class KevoreeComponentModel extends AbstractModel<kevoree.Component> {

  ports: { [s: string]: KevoreePortModel };

  constructor(instance?: kevoree.Component) {
    super('kevoree-component', instance);
    if (instance) {
      this.instance = instance;
      instance.provided.array.forEach((port) => this.addInput(port));
      instance.required.array.forEach((port) => this.addOutput(port));
    }
  }

  addInput(port: kevoree.Port) {
    return this.addPort(new KevoreePortModel(true, port));
  }

  addOutput(port: kevoree.Port) {
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