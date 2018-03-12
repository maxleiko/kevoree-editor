
import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';

import { KevoreeGroupModel } from '../models/KevoreeGroupModel';
import { KevoreeGroupWidget } from '../widgets/KevoreeGroupWidget';
import { KevoreeService } from '../../../services';

export class KevoreeGroupFactory extends AbstractNodeFactory {

  constructor(private _kService: KevoreeService) {
    super('kevoree-group');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeGroupModel): JSX.Element {
    return React.createElement(KevoreeGroupWidget, { node, diagramEngine });
  }

  getNewInstance(initConf?: any) {
    const group = this._kService.model.findByPath<kevoree.Group>(initConf.path);
    if (group) {
      return new KevoreeGroupModel(group);
    }
    throw new Error(`Unable to find instance "${initConf.path}" in current model`);
  }
}