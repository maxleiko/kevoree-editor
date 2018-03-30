import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from 'storm-react-diagrams';

import { KevoreeNodeModel } from '../models/KevoreeNodeModel';
import { KevoreeNodeWidget } from '../widgets/KevoreeNodeWidget';
import { KevoreeStore } from '../../../stores';

export class KevoreeNodeFactory extends AbstractNodeFactory {

  constructor(private _kStore: KevoreeStore) {
    super('kevoree-node');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeNodeModel): JSX.Element {
    return React.createElement(KevoreeNodeWidget, { node, diagramEngine });
  }

  getNewInstance(initConf?: any) {
    const node = this._kStore.model.getNode(initConf.name);
    if (node) {
      return new KevoreeNodeModel(node);
    }
    throw new Error(`Unable to find node instance "${initConf.name}" in stored model`);
  }
}