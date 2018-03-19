import * as kevoree from 'kevoree-library';
import * as _ from 'lodash';

import { AbstractModel } from './AbstractModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';

export class KevoreeChannelModel extends AbstractModel<kevoree.Channel> {

  ports: { [s: string]: KevoreeChannelPortModel };

  constructor(instance: kevoree.Channel) {
    super('kevoree-channel', instance);
    this.addPort(new KevoreeChannelPortModel(true));
    this.addPort(new KevoreeChannelPortModel(false));
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