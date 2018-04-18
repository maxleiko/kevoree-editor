import { Port } from 'kevoree-ts-model';
import { DefaultPortModel } from '@leiko/react-diagrams';

export class KevoreePortModel extends DefaultPortModel {

  port: Port;

  constructor(isInput: boolean, port: Port) {
    super(isInput, port.name!);
    this.port = port;
  }
}