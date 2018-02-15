import * as kevoree from 'kevoree-library';
import * as _ from 'lodash';
import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';
import { observable, action, computed } from 'mobx';

import {
  isComponentType,
  isNodeType,
  isChannelType,
  isGroupType
} from '../utils/kevoree';
import { KevoreeNodeModel } from '../widgets/node';
import { KevoreeComponentModel } from '../widgets/component';
import { KevoreeChannelModel } from '../widgets/channel';
import { KevoreeGroupModel } from '../widgets/group';
import { AbstractModel } from '../widgets/AbstractModel';

const registryModel: Array<kevoree.RTypeDefinition> = require('../assets/model.json');

export class KevoreeStore {
  
  private _diagram = new DiagramEngine();
  private _factory: kevoree.KevoreeFactory = new kevoree.factory.DefaultKevoreeFactory();

  @observable
  private _model = this._factory.createContainerRoot().withGenerated_KMF_ID(0);

  constructor() {
    this._diagram.setDiagramModel(new DiagramModel());
    this._factory.root(this._model);

    const loader = this._factory.createJSONLoader();

    registryModel.forEach((rTdef) => {
      // looking for this tdef's namespace in model
      let namespace = this._model.findPackagesByID(rTdef.namespace);
      if (!namespace) {
        // namespace is not in model: create it
        namespace = this._factory.createPackage().withName(rTdef.namespace);
        // add it to model
        this._model.addPackages(namespace);
      }
      // load the tdef's model
      const tdef = loader
        .loadModelFromString<kevoree.TypeDefinition>(rTdef.model)
        .get(0);
      // add it to the model
      namespace.addTypeDefinitions(tdef);
      // TODO merge it's DU
    });

    // tslint:disable-next-line
    console.log(this._model);
  }

  @action
  createInstance(
    tdef: kevoree.TypeDefinition | string,
    point: kwe.Point = { x: 100, y: 100 },
    container: kevoree.Model | kevoree.Node = this.model
  ) {
    if (typeof tdef === 'string') {
      tdef = this._model.findByPath<kevoree.TypeDefinition>(tdef as string);
    }

    let instanceModel: AbstractModel;
    if (isComponentType(tdef)) {
      instanceModel = this.createComponent(<kevoree.ComponentType> tdef, <kevoree.Node> container);
    } else if (isChannelType(tdef)) {
      instanceModel = this.createChannel(<kevoree.ChannelType> tdef, <kevoree.Model> container);
    } else if (isGroupType(tdef)) {
      instanceModel = this.createGroup(<kevoree.GroupType> tdef, <kevoree.Model> container);
    } else if (isNodeType(tdef)) {
      instanceModel = this.createNode(<kevoree.NodeType> tdef, <kevoree.Model> container);
    } else {
      throw new Error(`Unable to create instance of unknown type "${tdef.metaClassName()}"`);
    }
    instanceModel.setLocation(point);
    this._diagram.getDiagramModel().addNode(instanceModel);
    this._diagram.repaintCanvas();
  }

  @action
  createComponent(tdef: kevoree.ComponentType, container: kevoree.Node) {
    const instance: kevoree.Component = this._factory.createComponentInstance();
    instance.name = `comp${container.components.size()}`;
    instance.typeDefinition = tdef;
    container.addComponents(instance);
    return new KevoreeComponentModel(instance);
  }

  @action
  createNode(tdef: kevoree.NodeType, container: kevoree.Model) {
    const instance: kevoree.Node = this._factory.createContainerNode();
    instance.name = `node${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    container.addNodes(instance);
    return new KevoreeNodeModel(instance);
  }

  @action
  createChannel(tdef: kevoree.ChannelType, container: kevoree.Model) {
    const instance: kevoree.Channel = this._factory.createChannel();
    instance.name = `chan${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    container.addHubs(instance);
    return new KevoreeChannelModel(instance);
  }

  @action
  createGroup(tdef: kevoree.GroupType, container: kevoree.Model) {
    const instance: kevoree.Group = this._factory.createGroup();
    instance.name = `group${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    container.addGroups(instance);
    return new KevoreeGroupModel(instance);
  }

  get model() {
    return this._model;
  }

  get diagram() {
    return this._diagram;
  }

  @computed
  get nodes() {
    return this._model.nodes.array;
  }

  @computed
  get components() {
    return _.flatMap(this._model.nodes.array, (node) => {
      return node.components.array;
    });
  }

  @computed
  get channels() {
    return this._model.hubs.array;
  }

  @computed
  get groups() {
    return this._model.groups.array;
  }

  @computed
  get namespaces() {
    return this._model.packages.array;
  }

  @computed
  get typeDefinitions() {
    return _.flatMap(this._model.packages.array, (pkg) => {
      return pkg.typeDefinitions.array;
    });
  }
}