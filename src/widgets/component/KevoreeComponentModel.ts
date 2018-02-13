import * as _ from 'lodash';
import { NodeModel, DefaultPortModel } from 'storm-react-diagrams';
import * as ColorHash from 'color-hash';

export class KevoreeComponentModel extends NodeModel {

  instance: k.Component;
  color: string;
  ports: { [s: string]: DefaultPortModel };

  constructor(instance?: k.Component) {
    super('kevoree-component');
    if (instance) {
      this.instance = instance;
      this.color = new ColorHash().hex(instance.typeDefinition.name);
      instance.provided.forEach(({ name }) => this.addPort(new DefaultPortModel(true, name)));
      instance.required.forEach(({ name }) => this.addPort(new DefaultPortModel(false, name)));
    }
  }

  deSerialize(obj: any) {
    super.deSerialize(obj);
    this.instance = obj.instance;
    this.color = obj.color;
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