import * as _ from 'lodash';
import * as kevoree from 'kevoree-library';
import { PortModel } from 'storm-react-diagrams';

import { KevoreeLinkModel } from './KevoreeLinkModel';

export class KevoreePortModel extends PortModel {

  readonly isInput: boolean;
  port: kevoree.Port;

  constructor(isInput: boolean, port: kevoree.Port) {
    super(port.name, 'kevoree-port');
    this.isInput = isInput;
    this.port = port;
  }

  createLinkModel() {
    if (this.maximumLinks < _.size(this.links)) {
      return new KevoreeLinkModel();
    }
    return null;
  }
}