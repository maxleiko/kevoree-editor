import { DefaultPortModel } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';
import * as _ from 'lodash';

import { AbstractModel } from '../AbstractModel';

export class KevoreeComponentModel extends AbstractModel {

  instance: kevoree.Component;
  ports: { [s: string]: DefaultPortModel };

  constructor(instance?: kevoree.Component) {
    super('kevoree-component', instance ? instance.typeDefinition.name : undefined);
    if (instance) {
      this.instance = instance;
      instance.provided.array.forEach(({ name }) => this.addPort(new DefaultPortModel(true, name)));
      instance.required.array.forEach(({ name }) => this.addPort(new DefaultPortModel(false, name)));
    }
  }

  deSerialize(obj: any) {
    super.deSerialize(obj);
    this.instance = obj.instance;
    this.ports = {};
    obj.ports.forEach((port: any) => {
      const portModel = new DefaultPortModel(port.in, port.name, port.label, port.id);
      portModel.setParentNode(this);
      portModel.deSerialize(port);
      this.ports[port.id] = portModel;
    });
  }

  serialize() {
    return {
      ...super.serialize(),
      instance: this.instance,
    };
  }

  getInPorts(): DefaultPortModel[] {
    return _.filter(this.ports, portModel => {
      return portModel.in;
    });
  }

  getOutPorts(): DefaultPortModel[] {
    return _.filter(this.ports, portModel => {
      return !portModel.in;
    });
  }
}