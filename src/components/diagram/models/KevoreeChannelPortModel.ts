import { DefaultPortModel } from 'storm-react-diagrams';

export class KevoreeChannelPortModel extends DefaultPortModel {

  static INPUTS = 'inputs';
  static OUTPUTS = 'outputs';

  constructor(isInput: boolean) {
    const name = isInput ? KevoreeChannelPortModel.OUTPUTS : KevoreeChannelPortModel.INPUTS;
    super(isInput, name);
  }
}