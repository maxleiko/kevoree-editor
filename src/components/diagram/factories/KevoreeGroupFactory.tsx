import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from '@leiko/react-diagrams';

import { KevoreeGroupModel } from '../models/KevoreeGroupModel';
import { KevoreeGroupWidget } from '../widgets/KevoreeGroupWidget';
import { KevoreeStore } from '../../../stores';

export class KevoreeGroupFactory extends AbstractNodeFactory {

  constructor(private _kStore: KevoreeStore) {
    super('kevoree-group');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeGroupModel): JSX.Element {
    return React.createElement(KevoreeGroupWidget, { node, diagramEngine });
  }

  getNewInstance(initConf?: any) {
    const group = this._kStore.model.getGroup(initConf.name);
    if (group) {
      return new KevoreeGroupModel(group);
    }
    throw new Error(`Unable to find group instance "${initConf.name}" in stored model`);
  }
}