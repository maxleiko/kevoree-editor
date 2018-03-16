import { PortModel } from 'storm-react-diagrams';

import { KevoreeLinkModel } from './KevoreeLinkModel';

export class KevoreeChannelPortModel extends PortModel {

  readonly isInput: boolean;

  constructor(isInput: boolean) {
    super(isInput ? 'inputs' : 'outputs', 'kevoree-channel-port');
    this.isInput = isInput;
  }

  createLinkModel() {
    return new KevoreeLinkModel();
  }
}