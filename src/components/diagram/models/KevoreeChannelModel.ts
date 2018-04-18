import { Channel } from 'kevoree-ts-model';

import { AbstractModel } from './AbstractModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';
import { computed } from 'mobx';

export class KevoreeChannelModel extends AbstractModel<Channel, KevoreeChannelPortModel> {

  constructor(instance: Channel) {
    super('kevoree-channel', instance);
    this.addPort(new KevoreeChannelPortModel(true));
    this.addPort(new KevoreeChannelPortModel(false));
  }

  @computed
  get input(): KevoreeChannelPortModel {
    return this.getPort(KevoreeChannelPortModel.OUTPUTS)!;
  }

  @computed
  get output(): KevoreeChannelPortModel {
    return this.getPort(KevoreeChannelPortModel.INPUTS)!;
  }
}