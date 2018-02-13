import * as kevoree from 'kevoree-library';

import { KevoreeComponentModel } from './widgets/component';
import { KevoreeNodeModel } from './widgets/node';

const registryModel: Array<k.RTypeDefinition> = require('./assets/model.json');

export class KevoreeEngine {

  private count: number;
  private model: k.Model;
  private factory: k.KevoreeFactory;

  constructor() {
    this.count = 0;
    this.factory = new kevoree.factory.DefaultKevoreeFactory();
    const loader = this.factory.createJSONLoader();
    const kModel = this.factory.createContainerRoot().withGenerated_KMF_ID(0);
    this.factory.root(kModel);

    registryModel
      .forEach((tdef) => {
        const pkg = this.factory.createPackage();
        pkg.name = tdef.namespace;

        // TODO

        this.model.addPackages(pkg);
      });

    this.model = loader.loadModelFromString().get(0);
    // this.types = registryModel.map((rtdef: k.RTypeDefinition) => {
    //   return JSON.parse(rtdef.model);
    // });
  }

  public createInstance(tdef: k.TypeDefinition) {
    if (tdef.class.startsWith('org.kevoree.ComponentType')) {
      return this.createComponent(<k.ComponentType> tdef);
    } else if (tdef.class.startsWith('org.kevoree.ChannelType')) {
      return this.createChannel(<k.ChannelType> tdef);
    } else if (tdef.class.startsWith('org.kevoree.GroupType')) {
      return this.createGroup(<k.GroupType> tdef);
    } else if (tdef.class.startsWith('org.kevoree.NodeType')) {
      return this.createNode(<k.NodeType> tdef);
    }
    throw new Error(`Unable to create instance of unknown type "${tdef.class}"`);
  }

  public createComponent(tdef: k.ComponentType) {
    const instance: k.Component = this.factory.createComponentInstance();
    instance.name = 'comp' + this.count++;
    instance.typeDefinition = tdef;
    return new KevoreeComponentModel(instance);
  }

  public createNode(tdef: k.NodeType) {
    const instance: k.Node = this.factory.createContainerNode();
    instance.name = 'node' + this.count++;
    instance.typeDefinition = tdef;
    return new KevoreeNodeModel(instance);
  }

  public createChannel(tdef: k.ChannelType) {
    return null;
  }

  public createGroup(tdef: k.GroupType) {
    return null;
  }

  public getModel() {
    return this.model;
  }
}