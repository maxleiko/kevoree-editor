import { DefaultNodeModel, DefaultPortModel } from 'storm-react-diagrams';

import { TypeDefinition } from './types/kevoree.d';

export class Kevoree2DiagramFactory {

  public static create(tdef: TypeDefinition, count: number) {
    let node: DefaultNodeModel;
    switch (tdef.type) {
      case 'component':
        node = new DefaultNodeModel(tdef.name, 'rgb(192,0,255)');
        if (tdef.inputs) {
          tdef.inputs.forEach((name) => node.addPort(this.createInput(name)));
        }
        if (tdef.outputs) {
          tdef.outputs.forEach((name) => node.addPort(this.createOutput(name)));
        }
        break;

      case 'node':
        node = new DefaultNodeModel(tdef.name, 'rgb(255,192,0)');
        break;

      case 'channel':
        node = new DefaultNodeModel(tdef.name, 'rgb(0,192,255)');
        break;

      case 'group':
        node = new DefaultNodeModel(tdef.name, 'rgb(0,255,192)');
        break;

      default:
        throw new Error(`Unknown diagram node type "${tdef.type}"`);
    }

    return node;
  }

  private static createInput(name: string) {
    return new DefaultPortModel(true, name, name);
  }

  private static createOutput(name: string) {
    return new DefaultPortModel(false, name, name);
  }
}
