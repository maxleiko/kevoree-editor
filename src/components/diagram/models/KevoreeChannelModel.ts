import * as kevoree from 'kevoree-library';

import { AbstractModel } from './AbstractModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';

export class KevoreeChannelModel extends AbstractModel<kevoree.Channel> {

  inputs: KevoreeChannelPortModel;
  outputs: KevoreeChannelPortModel;

  constructor(instance: kevoree.Channel) {
    super('kevoree-channel', instance);
    this.inputs = new KevoreeChannelPortModel(true);
    this.outputs = new KevoreeChannelPortModel(false);
  }

  getInputs() {
    return this.inputs;
  }

  getOutputs() {
    return this.outputs;
  }
}