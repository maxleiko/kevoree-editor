import { DefaultNodeModel } from 'storm-react-diagrams';
import * as ColorHash from 'color-hash';

import { TypeDefinition } from '../../types/kevoree';

export class KevoreeComponentModel extends DefaultNodeModel {

  constructor(tdef: TypeDefinition | undefined = undefined, count: number = 0) {
    super('kevoree-component');
    if (tdef) {
      this.name = `comp${count}: ${tdef.name}`;
      this.color = new ColorHash().hex(tdef.name);
    }
  }
}