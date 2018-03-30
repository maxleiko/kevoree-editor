import { Port } from 'kevoree-ts-model';
import { PortModel } from 'storm-react-diagrams';

import { KevoreeLinkModel } from './KevoreeLinkModel';
import { KevoreeChannelModel } from '.';

export class KevoreePortModel extends PortModel {

  isInput: boolean;
  port: Port;

  constructor(isInput: boolean, port: Port) {
    super(port.name!, 'kevoree-port', port.path);
    this.isInput = isInput;
    this.port = port;

    if (this.parent && this.parent.parent) {
      this.port.bindings.forEach((binding) => {
        if (binding.channel) {
          const link = this.createLinkModel();
          link.setSourcePort(this);
          const chanVM = this.parent.parent.getNode(binding.channel.path) as KevoreeChannelModel;
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