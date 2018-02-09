import { DefaultNodeModel } from 'storm-react-diagrams';
import * as ColorHash from 'color-hash';

import { TypeDefinition } from '../../types/kevoree';

export class KevoreeComponentModel extends DefaultNodeModel {

  constructor(tdef: TypeDefinition, count: number) {
    const color = new ColorHash();
    super(`comp${count}: ${tdef.name}`, color.hex(tdef.name));
  }
}