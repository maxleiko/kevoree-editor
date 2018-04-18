
import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from '@leiko/react-diagrams';

import { KevoreeChannelModel } from '../models/KevoreeChannelModel';
import { KevoreeChannelWidget } from '../widgets/KevoreeChannelWidget';
import { KevoreeStore } from '../../../stores';

export class KevoreeChannelFactory extends AbstractNodeFactory {

  constructor(private _kStore: KevoreeStore) {
    super('kevoree-channel');
  }

  generateReactWidget(engine: DiagramEngine, node: KevoreeChannelModel): JSX.Element {
    return <KevoreeChannelWidget engine={engine} node={node} />;
  }

  getNewInstance(initConf?: any) {
    const chan = this._kStore.model.getChannel(initConf.name);
    if (chan) {
      return new KevoreeChannelModel(chan);
    }
    throw new Error(`Unable to find channel instance "${initConf.name}" in stored model`);
  }
}