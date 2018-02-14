import * as kevoree from 'kevoree-library';

import { isComponentType, isNodeType, isChannelType, isGroupType } from './utils/kevoree';
import { KevoreeNodeModel } from './widgets/node';
import { KevoreeComponentModel } from './widgets/component';
import { KevoreeChannelModel } from './widgets/channel';
import { KevoreeGroupModel } from './widgets/group';

const registryModel: Array<kevoree.RTypeDefinition> = require('./assets/model.json');

export class KevoreeEngine {

  private model: kevoree.Model;
  private factory: kevoree.KevoreeFactory;

  constructor() {
    this.factory = new kevoree.factory.DefaultKevoreeFactory();
    this.model = this.factory.createContainerRoot().withGenerated_KMF_ID(0);
    this.factory.root(this.model);

    const loader = this.factory.createJSONLoader();

    registryModel
      .forEach((rTdef) => {
        // looking for this tdef's namespace in model
        let namespace = this.model.findPackagesByID(rTdef.namespace);
        if (!namespace) {
          // namespace is not in model: create it
          namespace = this.factory.createPackage().withName(rTdef.namespace);
          // add it to model
          this.model.addPackages(namespace);
        }
        // load the tdef's model
        const tdef = loader.loadModelFromString<kevoree.TypeDefinition>(rTdef.model).get(0);
        // add it to the model
        namespace.addTypeDefinitions(tdef);
        // TODO merge it's DU
      });

    // tslint:disable-next-line
    console.log(this.model);
  }

  public createInstance(tdef: kevoree.TypeDefinition, container: kevoree.Model | kevoree.Node = this.model) {
    if (isComponentType(tdef)) {
      return this.createComponent(<kevoree.ComponentType> tdef, <kevoree.Node> container);
      
    } else if (isChannelType(tdef)) {
      return this.createChannel(<kevoree.ChannelType> tdef, <kevoree.Model> container);

    } else if (isGroupType(tdef)) {
      return this.createGroup(<kevoree.GroupType> tdef, <kevoree.Model> container);

    } else if (isNodeType(tdef)) {
      return this.createNode(<kevoree.NodeType> tdef, <kevoree.Model> container);
    }
    throw new Error(`Unable to create instance of unknown type "${tdef.metaClassName()}"`);
  }

  public createComponent(tdef: kevoree.ComponentType, container: kevoree.Node) {
    const instance: kevoree.Component = this.factory.createComponentInstance();
    instance.name = `comp${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    container.addComponents(instance);
    return new KevoreeComponentModel(instance);
  }

  public createNode(tdef: kevoree.NodeType, container: kevoree.Model) {
    const instance: kevoree.Node = this.factory.createContainerNode();
    instance.name = `node${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    container.addNodes(instance);
    return new KevoreeNodeModel(instance);
  }

  public createChannel(tdef: kevoree.ChannelType, container: kevoree.Model) {
    const instance: kevoree.Channel = this.factory.createChannel();
    instance.name = `chan${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    container.addHubs(instance);
    return new KevoreeChannelModel(instance);
  }

  public createGroup(tdef: kevoree.GroupType, container: kevoree.Model) {
    const instance: kevoree.Group = this.factory.createGroup();
    instance.name = `group${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    container.addGroups(instance);
    return new KevoreeGroupModel(instance);
  }

  public getModel() {
    return this.model;
  }
}