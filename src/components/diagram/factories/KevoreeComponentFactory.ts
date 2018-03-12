
import * as React from 'react';
import { DiagramEngine, AbstractNodeFactory } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';

import { KevoreeComponentModel } from '../models/KevoreeComponentModel';
import { KevoreeComponentWidget } from '../widgets/KevoreeComponentWidget';
import { KevoreeService } from '../../../services';

export class KevoreeComponentFactory extends AbstractNodeFactory {

  constructor(private _kService: KevoreeService) {
    super('kevoree-component');
  }

  generateReactWidget(diagramEngine: DiagramEngine, node: KevoreeComponentModel): JSX.Element {
    return React.createElement(KevoreeComponentWidget, { node, diagramEngine });
  }

  getNewInstance(initConf?: any) {
    const comp = this._kService.model.findByPath<kevoree.Component>(initConf.path);
    if (comp) {
      return new KevoreeComponentModel(comp);
    }
    throw new Error(`Unable to find instance "${initConf.path}" in current model`);
  }
}