import * as React from 'react';
import { DiagramEngine, AbstractNodeFactory } from '@leiko/react-diagrams';

import { KevoreeComponentModel } from '../models/KevoreeComponentModel';
import { KevoreeComponentWidget } from '../widgets/KevoreeComponentWidget';
import { KevoreeStore } from '../../../stores';

export class KevoreeComponentFactory extends AbstractNodeFactory {

  constructor(private _kStore: KevoreeStore) {
    super('kevoree-component');
  }

  generateReactWidget(engine: DiagramEngine, node: KevoreeComponentModel): JSX.Element {
    return <KevoreeComponentWidget engine={engine} node={node} />;
  }

  getNewInstance(initConf?: any) {
    const node = this._kStore.model.getNode(initConf.parent.name);
    if (node) {
      const comp = node.getComponent(initConf.name);
      if (comp) {
        return new KevoreeComponentModel(comp);
      }
    }
    throw new Error(`Unable to find component instance "${initConf.name}" in node "${initConf.parent.name}"`);
  }
}