import { action } from 'mobx';
import { DefaultPortModel, PortModel } from '@leiko/react-diagrams';
import { KevoreePortModel } from './KevoreePortModel';
import { KevoreeLinkModel } from './KevoreeLinkModel';

export class KevoreeChannelPortModel extends DefaultPortModel {

  static INPUTS = 'inputs';
  static OUTPUTS = 'outputs';

  constructor(isInput: boolean) {
    const name = isInput ? KevoreeChannelPortModel.OUTPUTS : KevoreeChannelPortModel.INPUTS;
    super(isInput, name);
    this.id = name;
  }

  canLinkToPort(p: PortModel): boolean {
    if (p instanceof KevoreePortModel) {
      return true;
    } else if (p instanceof KevoreeChannelPortModel) {
      return false;
    }
    return super.canLinkToPort(p);
  }

  @action
  link(port: PortModel): KevoreeLinkModel {
    const link = new KevoreeLinkModel();
    link.connect(this, port);
    return link;
  }
}