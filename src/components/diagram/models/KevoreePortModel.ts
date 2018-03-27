import * as kevoree from 'kevoree-library';
import { PortModel } from 'storm-react-diagrams';

import { KevoreeLinkModel } from './KevoreeLinkModel';
import { KevoreeChannelModel } from '.';

export class KevoreePortModel extends PortModel {

  isInput: boolean;
  port: kevoree.Port;

  constructor(isInput: boolean, port: kevoree.Port) {
    super(port.name, 'kevoree-port', port.path());
    this.isInput = isInput;
    this.port = port;

    if (this.parent && this.parent.parent) {
      this.port.bindings.array.forEach((binding) => {
        if (binding.hub) {
          const link = this.createLinkModel();
          link.setSourcePort(this);
          const chanVM = this.parent.parent.getNode(binding.hub.path()) as KevoreeChannelModel;
          if (chanVM) {
            const targetPort = this.isInput ? chanVM.getInputs() : chanVM.getOutputs();
            link.setTargetPort(targetPort);
            this.addLink(link);
          }
        }
      });
    }
  }

  createLinkModel() {
    return new KevoreeLinkModel();
  }
}