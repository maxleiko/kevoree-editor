import { DefaultPortModel } from 'storm-react-diagrams';
import { ComponentType, NodeType, TypeDefinition } from './types/kevoree';
import { KevoreeComponentModel } from './widgets/component';
import { KevoreeNodeModel } from './widgets/node';

export class KevoreeEngine {

  private nodeInstances = 0;
  private compInstances = 0;
  private types: TypeDefinition[] = [];

  public createInstance(tdef: TypeDefinition) {
    switch (tdef.type) {
      case 'component':
        return this.createComponent(tdef);

      case 'node':
        return this.createNode(tdef);

      default:
        throw new Error('Unable to create instance of unknown type.');
    }
  }

  public createComponent(tdef: ComponentType) {
    const comp = new KevoreeComponentModel(tdef, this.compInstances++);
    if (tdef.inputs) {
      tdef.inputs.forEach((name) => comp.addPort(new DefaultPortModel(true, name, name)));
    }
    if (tdef.outputs) {
      tdef.outputs.forEach((name) => comp.addPort(new DefaultPortModel(false, name, name)));
    }
    return comp;
  }

  public createNode(tdef: NodeType) {
    return new KevoreeNodeModel(tdef, this.nodeInstances++);
  }

  addTypes(types: TypeDefinition[]) {
    types.forEach((type) => this.addType(type));
  }

  addType(type: TypeDefinition) {
    this.types.push(type);
  }

  getTypes() {
    return this.types;
  }
}