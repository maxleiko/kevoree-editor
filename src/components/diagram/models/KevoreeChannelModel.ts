import { Channel } from 'kevoree-ts-model';

import { AbstractModel } from './AbstractModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';
import { computed } from 'mobx';

export class KevoreeChannelModel extends AbstractModel<Channel, KevoreeChannelPortModel> {

  private _input = new KevoreeChannelPortModel(true);
  private _output = new KevoreeChannelPortModel(false);

  constructor(instance: Channel) {
    super('kevoree-channel', instance);
    this.addPort(this._input);
    this.addPort(this._output);
  }

  @computed
  get input(): KevoreeChannelPortModel {
    return this.portsMap.get(this._output.id)!;
  }

  @computed
  get output(): KevoreeChannelPortModel {
    return this.portsMap.get(this._input.id)!;
  }
}