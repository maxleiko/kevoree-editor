import { DefaultPortModel, PortModel } from '@leiko/react-diagrams';
import { KevoreePortModel } from './KevoreePortModel';

export class KevoreeChannelPortModel extends DefaultPortModel {

  static INPUTS = 'inputs';
  static OUTPUTS = 'outputs';

  constructor(isInput: boolean) {
    const name = isInput ? KevoreeChannelPortModel.OUTPUTS : KevoreeChannelPortModel.INPUTS;
    super(isInput, name);
  }

  canLinkToPort(p: PortModel): boolean {
    if (p instanceof KevoreePortModel) {
      return true;
    } else if (p instanceof KevoreeChannelPortModel) {
      return false;
    }
    return super.canLinkToPort(p);
  }
}