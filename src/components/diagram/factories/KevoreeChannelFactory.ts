
import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';

import { KevoreeChannelModel } from '../models/KevoreeChannelModel';
import { KevoreeChannelWidget } from '../widgets/KevoreeChannelWidget';
import { KevoreeService } from '../../../services';

export class KevoreeChannelFactory extends AbstractNodeFactory {

  constructor(private _kService: KevoreeService) {
    super('kevoree-channel');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeChannelModel): JSX.Element {
    return React.createElement(KevoreeChannelWidget, { node, diagramEngine });
  }

  getNewInstance(initConf?: any) {
    const chan = this._kService.model.findByPath<kevoree.Channel>(initConf.path);
    if (chan) {
      return new KevoreeChannelModel(chan);
    }
    throw new Error(`Unable to find instance "${initConf.path}" in current model`);
  }
}