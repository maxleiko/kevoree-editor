import * as React from 'react';
import * as cx from 'classnames';
import { AbstractLinkFactory, DiagramEngine } from 'storm-react-diagrams';

import { KevoreeLinkModel } from '../models/KevoreeLinkModel';
import { KevoreeLinkWidget } from '../widgets/KevoreeLinkWidget';

export class KevoreeLinkFactory extends AbstractLinkFactory {

  constructor() {
    super('kevoree-link');
  }

  generateReactWidget(diagramEngine: DiagramEngine, link: KevoreeLinkModel): JSX.Element {
    return React.createElement(KevoreeLinkWidget, { link, diagramEngine });
  }

  getNewInstance(initialConfig?: any): KevoreeLinkModel {
    return new KevoreeLinkModel();
  }

  generateLinkSegment(model: KevoreeLinkModel, widget: KevoreeLinkWidget, selected: boolean, path: string) {
    return (
      <path
        className={cx({ selected, reverse: model.getSourcePort().isInput })}
        strokeWidth={model.width}
        stroke={model.color}
        d={path}
      />
    );
  }
}