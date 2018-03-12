
import * as React from 'react';
import { AbstractNodeFactory, DiagramEngine } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';

import { KevoreeNodeModel } from '../models/KevoreeNodeModel';
import { KevoreeNodeWidget } from '../widgets/KevoreeNodeWidget';
import { KevoreeService } from '../../../services';

export class KevoreeNodeFactory extends AbstractNodeFactory {

  constructor(private _kService: KevoreeService) {
    super('kevoree-node');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeNodeModel): JSX.Element {
    return React.createElement(KevoreeNodeWidget, { node, diagramEngine });
  }

  getNewInstance(initConf?: any) {
    const node = this._kService.model.findByPath<kevoree.Node>(initConf.path);
    if (node) {
      return new KevoreeNodeModel(node);
    }
    throw new Error(`Unable to find instance "${initConf.path}" in current model`);
  }
}