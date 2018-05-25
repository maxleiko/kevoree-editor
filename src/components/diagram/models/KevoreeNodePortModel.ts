import { PortModel, DefaultPortModel } from '@leiko/react-diagrams';

export class KevoreeNodePortModel extends DefaultPortModel {

  static INPUT = 'input';
  static OUTPUT = 'output';

  constructor(isInput: boolean) {
    super(isInput, isInput ? KevoreeNodePortModel.INPUT : KevoreeNodePortModel.OUTPUT);
  }

  canLinkToPort(p: PortModel): boolean {
    if (p instanceof KevoreeNodePortModel) {
      return true;
    }
    return false;
  }
}