import { Port } from 'kevoree-ts-model';
import { DefaultPortModel, PortModel } from '@leiko/react-diagrams';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';

export class KevoreePortModel extends DefaultPortModel {

  port: Port;

  constructor(isInput: boolean, port: Port) {
    super(isInput, port.name!);
    this.port = port;
  }

  canLinkToPort(p: PortModel): boolean {
    if (p instanceof KevoreePortModel) {
      // chose a Channel to connect them
      // tslint:disable-next-line
      console.log('===== CHOOSE A CHANNEL =====');
      // tslint:disable-next-line
      console.log('to link', this, 'to', p);
      return true;
    } else if (p instanceof KevoreeChannelPortModel) {
      return true;
    }
    return super.canLinkToPort(p);
  }
}