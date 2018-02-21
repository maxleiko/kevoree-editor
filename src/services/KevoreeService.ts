import * as kevoree from 'kevoree-library';
import * as Kotlin from 'kevoree-kotlin';
import * as kRegistry from 'kevoree-registry-client';
import * as _ from 'lodash';
import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';
import { toast } from 'react-toastify';

import { isComponentType, isNodeType, isChannelType, isGroupType, isTruish } from '../utils/kevoree';
import { KevoreeNodeFactory } from '../widgets/node';
import { KevoreeComponentFactory } from '../widgets/component';
import { KevoreeChannelFactory } from '../widgets/channel';
import { KevoreeGroupFactory } from '../widgets/group';
import { KevoreeNodeModel } from '../widgets/node';
import { KevoreeComponentModel } from '../widgets/component';
import { KevoreeChannelModel } from '../widgets/channel';
import { KevoreeGroupModel } from '../widgets/group';
import { AbstractModel } from '../widgets/AbstractModel';

export class KevoreeService {
  
  private _diagram = new DiagramEngine();
  private _factory: kevoree.KevoreeFactory = new kevoree.factory.DefaultKevoreeFactory();
  private _model = this._factory.createContainerRoot().withGenerated_KMF_ID(0);
  private _loader = this._factory.createJSONLoader();
  // private _serializer = this._factory.createJSONSerializer();

  constructor() {
    this._diagram.registerNodeFactory(new KevoreeComponentFactory());
    this._diagram.registerNodeFactory(new KevoreeNodeFactory());
    this._diagram.registerNodeFactory(new KevoreeChannelFactory());
    this._diagram.registerNodeFactory(new KevoreeGroupFactory());
    this._diagram.installDefaultFactories();
    this._diagram.setDiagramModel(new DiagramModel());
    this._factory.root(this._model);

    // tslint:disable-next-line
    window['model'] = this._model;
  }

  createInstance(
    tdef: kevoree.TypeDefinition | string,
    point: kwe.Point = { x: 100, y: 100 },
    container: kevoree.Model | kevoree.Node = this.model
  ) {
    if (typeof tdef === 'string') {
      tdef = this._model.findByPath<kevoree.TypeDefinition>(tdef as string);
    }

    let diagramNode: AbstractModel;
    const diagramModel = this._diagram.getDiagramModel();

    if (isComponentType(tdef)) {
      const nodes = this._diagram.getDiagramModel().getSelectedItems()
        .filter((model) => model instanceof KevoreeNodeModel);

      if (nodes.length > 0) {
        nodes.map((node: KevoreeNodeModel) => {
          const comp = this.createComponent(<kevoree.ComponentType> tdef, node.instance);
          node.addComponent(comp);
        });
      } else {
        toast.error('Components must be added in Nodes');
      }

    } else if (isChannelType(tdef)) {
      diagramNode = this.createChannel(<kevoree.ChannelType> tdef, <kevoree.Model> container);
      diagramNode.setLocation(point);
      diagramModel.addNode(diagramNode);
    } else if (isGroupType(tdef)) {
      diagramNode = this.createGroup(<kevoree.GroupType> tdef, <kevoree.Model> container);
      diagramNode.setLocation(point);
      diagramModel.addNode(diagramNode);
    } else if (isNodeType(tdef)) {
      diagramNode = this.createNode(<kevoree.NodeType> tdef, <kevoree.Model> container);
      diagramNode.setLocation(point);
      diagramModel.addNode(diagramNode);
    } else {
      throw new Error(`Unable to create instance of unknown type "${tdef.metaClassName()}"`);
    }
  }

  updateNamespaces(nss: kRegistry.INamespace[]) {
    const newNamespaces = new Kotlin.ArrayList<kevoree.Namespace>();
    nss
      .filter((ns) => this._model.findPackagesByID(ns.name) === null)
      .map((ns) => this._factory.createPackage().withName(ns.name))
      .forEach((ns) => newNamespaces.add_za3rmp$(ns));
    
    if (newNamespaces.array.length > 0) {
      this._model.addAllPackages(newNamespaces);
    }
  }

  updateTypeDefinitions(namespace: string, rTdefs: kRegistry.ITypeDefinition[]) {
    const newTdefs = new Kotlin.ArrayList<kevoree.TypeDefinition>();

    // create namespace if necessary
    this.updateNamespaces([{ name: namespace }]);

    rTdefs.forEach((rTdef) => {
      // load the tdef's model and add it to the list
      newTdefs.add_za3rmp$(this._loader
        .loadModelFromString<kevoree.TypeDefinition>(rTdef.model)
        .get(0));
    });

    // get namespace from model
    const ns = this._model.findPackagesByID(namespace);

    // add all tdefs in one batch
    ns.addAllTypeDefinitions(newTdefs);
  }

  private createComponent(tdef: kevoree.ComponentType, container: kevoree.Node) {
    const instance: kevoree.Component = this._factory.createComponentInstance();
    instance.name = `comp${container.components.size()}`;
    instance.typeDefinition = tdef;
    this.initDictionaries(instance);
    container.addComponents(instance);
    return new KevoreeComponentModel(instance);
  }

  private createNode(tdef: kevoree.NodeType, container: kevoree.Model) {
    const instance: kevoree.Node = this._factory.createContainerNode();
    instance.name = `node${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    this.initDictionaries(instance);
    container.addNodes(instance);
    return new KevoreeNodeModel(instance);
  }

  private createChannel(tdef: kevoree.ChannelType, container: kevoree.Model) {
    const instance: kevoree.Channel = this._factory.createChannel();
    instance.name = `chan${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    this.initDictionaries(instance);
    container.addHubs(instance);
    return new KevoreeChannelModel(instance);
  }

  private createGroup(tdef: kevoree.GroupType, container: kevoree.Model) {
    const instance: kevoree.Group = this._factory.createGroup();
    instance.name = `group${container.nodes.size()}`;
    instance.typeDefinition = tdef;
    this.initDictionaries(instance);
    container.addGroups(instance);
    return new KevoreeGroupModel(instance);
  }

  private initDictionaries(instance: kevoree.Instance) {
    instance.dictionary = instance.dictionary || this._factory.createDictionary()
      .withGenerated_KMF_ID('0.0');
    const dicType = instance.typeDefinition.dictionaryType;
    if (dicType) {
      dicType.attributes.array.forEach((attr) => {
        let val: kevoree.Value<kevoree.Dictionary>;
        if (!isTruish(attr.fragmentDependant)) {
          // attribute is not fragment dependant
          val = instance.dictionary.findValuesByID(attr.name);
          if (!val) {
            val = this._factory.createValue<kevoree.Dictionary>();
            val.name = attr.name;
            val.value = attr.defaultValue;
            instance.dictionary.addValues(val);
          }
        } else {
          // attribute is fragment dependant
          // create fragment dictionaries if needed
          if (isChannelType(instance.typeDefinition)) {
            (instance as kevoree.Channel).bindings.array.forEach((binding) => {
              if (binding.port) {
                if (!instance.findFragmentDictionaryByID(binding.port.eContainer().eContainer().name)) {
                  const fragDic = this._factory.createFragmentDictionary();
                  fragDic.name = binding.port.eContainer().eContainer().name;
                  (instance as kevoree.Channel).addFragmentDictionary(fragDic);
                }
              }
            });
          } else if (isGroupType(instance.typeDefinition)) {
            (instance as kevoree.Group).subNodes.array.forEach((node) => {
              if (!instance.findFragmentDictionaryByID(node.name)) {
                const fragDic = this._factory.createFragmentDictionary();
                fragDic.name = node.name;
                (instance as kevoree.Group).addFragmentDictionary(fragDic);
              }
            });
          }

          // add default value to fragment dictionaries that does not already have them
          instance.fragmentDictionary.array.forEach((fDic) => {
            val = fDic.findValuesByID(attr.name);
            if (!val) {
              val = this._factory.createValue();
              val.name = attr.name;
              val.value = attr.defaultValue;
              fDic.addValues(val);
            }
          });
        }
      });
    }
  }

  get model() {
    return this._model;
  }

  get diagram() {
    return this._diagram;
  }

  get nodes() {
    return this._model.nodes.array;
  }

  get components() {
    return _.flatMap(this._model.nodes.array, (n) => n.components.array);
  }

  get channels() {
    return this._model.hubs.array;
  }

  get groups() {
    return this._model.groups.array;
  }

  get namespaces() {
    return this._model.packages.array;
  }

  get typeDefinitions() {
    return _.flatMap(this._model.packages.array, (p) => p.typeDefinitions.array);
  }
}