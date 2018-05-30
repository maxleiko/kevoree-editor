import { DefaultLinkModel } from '@leiko/react-diagrams';
import { computed } from 'mobx';
import { Binding } from 'kevoree-ts-model';

export class KevoreeLinkModel extends DefaultLinkModel {

  constructor(color?: string, width?: number, curvyness?: number) {
    super(color, width, curvyness);
  }

  @computed
  get binding(): Binding | null {
    if (this.sourcePort && this.targetPort) {
      // TODO
      
    }
    return null;
  }
}