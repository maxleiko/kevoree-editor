import { PortModel } from 'storm-react-diagrams';

import { KevoreeLinkModel } from './KevoreeLinkModel';

export class KevoreeChannelPortModel extends PortModel {

  static INPUTS = 'inputs';
  static OUTPUTS = 'outputs';

  readonly isInput: boolean;

  constructor(isInput: boolean) {
    const name = isInput ? KevoreeChannelPortModel.INPUTS : KevoreeChannelPortModel.OUTPUTS;
    super(name, 'kevoree-channel-port', name);
    this.isInput = isInput;
  }

  createLinkModel() {
    return new KevoreeLinkModel();
  }
}