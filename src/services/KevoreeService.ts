import * as kevoree from 'kevoree-library';
import * as Kotlin from 'kevoree-kotlin';
import * as _ from 'lodash';
import { INamespace, ITypeDefinition } from 'kevoree-registry-client';

import * as kUtils from '../utils/kevoree';
import {
  DiagramListener,
  NodeEvent,
  LinkEvent,
  OffsetEvent,
  ZoomEvent,
  GridEvent 
} from 'storm-react-diagrams';
import { AbstractModel } from '../components/diagram/models';
import { KevoreeLinkModel } from '../components/diagram/models/KevoreeLinkModel';

export interface KevoreeServiceListener {
  modelChanged: () => void;
}

export class KevoreeService implements DiagramListener<AbstractModel, KevoreeLinkModel> {
  
  private _factory: kevoree.KevoreeFactory = new kevoree.factory.DefaultKevoreeFactory();
  private _model = this._factory.createContainerRoot().withGenerated_KMF_ID(0);
  private _loader = this._factory.createJSONLoader();
  private _serializer = this._factory.createJSONSerializer();
  private _listeners: KevoreeServiceListener[] = [];
  private _nodesCount = 0;
  private _groupsCount = 0;
  private _chansCount = 0;
  private _compsCount: Map<string, number> = new Map();

  constructor() {
    this._factory.root(this._model);
    this.initInstanceCounters();

    if (process.env.NODE_ENV !== 'production') {
      // tslint:disable-next-line
      window['model'] = this._model;
    }
  }

  createInstance(rTdef: ITypeDefinition, containerPath: string, point: kwe.Point = { x: 100, y: 100 }) {
    const tdef: kevoree.TypeDefinition = this.findOrCreateTypeDefinition(rTdef);
    const container = this._model.findByPath(containerPath);

    if (container) {
      if (kUtils.isNode(container)) {
        if (kUtils.isComponentType(tdef)) {
          this.createComponent(<kevoree.ComponentType> tdef, container as kevoree.Node, point);
        } else if (kUtils.isChannelType(tdef)) {
          this.createChannel(tdef as kevoree.ChannelType, this._model as kevoree.Model, point);
        } else if (kUtils.isGroupType(tdef)) {
          throw new Error('Groups must be added to model root');
        } else if (kUtils.isNodeType(tdef)) {
          throw new Error('Nodes must be added to model root');
        } else {
          throw new Error(`Unable to create instance of unknown type "${tdef.metaClassName()}"`);
        }
      } else {
        if (kUtils.isComponentType(tdef)) {
          if (this.selectedNodes.length > 0) {
            this.selectedNodes
              .map((node) => this.createComponent(tdef as kevoree.ComponentType, node, point));
          } else {
            throw new Error('Components must be added in Nodes');
          }
        } else if (kUtils.isChannelType(tdef)) {
          this.createChannel(tdef as kevoree.ChannelType, container as kevoree.Model, point);
        } else if (kUtils.isGroupType(tdef)) {
          this.createGroup(tdef as kevoree.GroupType, container as kevoree.Model, point);
        } else if (kUtils.isNodeType(tdef)) {
          this.createNode(tdef as kevoree.NodeType, container as kevoree.Model, point);
        } else {
          throw new Error(`Unable to create instance of unknown type "${tdef.metaClassName()}"`);
        }
      }
    } else {
      throw new Error(`Unable to find "${containerPath}" in the model`);
    }
  }

  updateNamespaces(nss: INamespace[]) {
    const newNamespaces = new Kotlin.ArrayList<kevoree.Namespace>();
    nss
      .filter((ns) => this._model.findPackagesByID(ns.name) === null)
      .map((ns) => this._factory.createPackage().withName(ns.name))
      .forEach((ns) => newNamespaces.add_za3rmp$(ns));
    
    if (newNamespaces.array.length > 0) {
      this._model.addAllPackages(newNamespaces);
    }
  }

  updateTypeDefinitions(namespace: string, rTdefs: ITypeDefinition[]) {
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

  getSelection(path: string) {
    let selection: kevoree.Instance[] = [];
    const elem = this._model.findByPath(path);
    if (elem) {
      if (kUtils.isNode(elem)) {
        const node = elem as kevoree.Node;
        selection = selection
          .concat(node.components.array);
      } else if (kUtils.isModel(elem)) {
        const model = elem as kevoree.Model;
        selection = selection
          .concat(model.nodes.array)
          .concat(model.groups.array)
          .concat(model.hubs.array);
      }
    }
    return selection.filter(kUtils.isSelected);
  }

  serialize() {
    return this._serializer.serialize(this._model);
  }

  deserialize(data: string) {
    try {
      this._model = this._loader.loadModelFromString<kevoree.Model>(data).get(0);
    } catch (err) {
      throw new Error('Unable to deserialize the model');
    } finally {
      this.initInstanceCounters();
      if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line
        window['model'] = this._model;
      }
      this._listeners.forEach((listener) => listener.modelChanged());
    }
  }

  addListener(listener: KevoreeServiceListener) {
    this._listeners.push(listener);
  }

  removeListener(listener: KevoreeServiceListener) {
    this._listeners.splice(this._listeners.findIndex((l) => l === listener), 1);
  }

  nodesUpdated(event: NodeEvent<AbstractModel>) {
    if (event.isCreated) {
      const uid = event.node.addListener({
        selectionChanged: ({ entity, isSelected }) => {
          kUtils.setSelected((entity as AbstractModel).instance, isSelected);
        },
        entityRemoved: () => {
          event.node.removeListener(uid);
          event.node.instance.delete();
        }
      });
    }
  }
  
  linksUpdated(event: LinkEvent<KevoreeLinkModel>) {
    // tslint:disable-next-line
    console.log('links.updated', event);
    if (event.isCreated) {
     const uid = event.link.addListener({
        sourcePortChanged: (e) => {
          // tslint:disable-next-line
          console.log('links.source', e);
        },
        targetPortChanged: (e) => {
          // tslint:disable-next-line
          console.log('links.target', e);
          // create new binding
          
        },
        entityRemoved: () => {
          event.link.removeListener(uid);
          event.link.binding.delete();
        }
      });
    }
  }
  
  offsetUpdated(event: OffsetEvent) {
    // TODO
  }
  
  zoomUpdated(event: ZoomEvent) {
    // TODO
  }

  gridUpdated(event: GridEvent) {
    // TODO
  }

  private initInstanceCounters() {
    this._nodesCount = this._model.nodes.array.length;
    this._groupsCount = this._model.groups.array.length;
    this._chansCount = this._model.hubs.array.length;
    this._compsCount = new Map();
    this._model.nodes.array.forEach((node) => {
      this._compsCount.set(node.name, node.components.array.length - 1);
    });
  }

  private findOrCreateTypeDefinition(rTdef: ITypeDefinition) {
    const path = `/packages[${rTdef.namespace!}]/typeDefinitions[name=${rTdef.name},version=${rTdef.version}]`;
    let tdef = this._model.findByPath<kevoree.TypeDefinition>(path);
    if (!tdef) {
      this.updateTypeDefinitions(rTdef.namespace!, [rTdef]);
      tdef = this._model.findByPath<kevoree.TypeDefinition>(path)!;
    }
    return tdef;
  }

  private createComponent(tdef: kevoree.ComponentType, container: kevoree.Node, point: kwe.Point) {
    const instance: kevoree.Component = this._factory.createComponentInstance();
    let compCount = this._compsCount.get(container.name)!;
    if (typeof compCount === 'undefined') {
      compCount = -1;
    }
    compCount++;
    this._compsCount.set(container.name, compCount);
    instance.name = `comp${compCount}`;
    instance.typeDefinition = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    this.initPorts(instance);
    container.addComponents(instance);
  }

  private createNode(tdef: kevoree.NodeType, container: kevoree.Model, point: kwe.Point) {
    const instance: kevoree.Node = this._factory.createContainerNode();
    instance.name = `node${this._nodesCount++}`;
    instance.typeDefinition = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addNodes(instance);
  }

  private createChannel(tdef: kevoree.ChannelType, container: kevoree.Model, point: kwe.Point) {
    const instance: kevoree.Channel = this._factory.createChannel();
    instance.name = `chan${this._chansCount++}`;
    instance.typeDefinition = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addHubs(instance);
  }

  private createGroup(tdef: kevoree.GroupType, container: kevoree.Model, point: kwe.Point) {
    const instance: kevoree.Group = this._factory.createGroup();
    instance.name = `group${this._groupsCount++}`;
    instance.typeDefinition = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addGroups(instance);
  }

  private createPort(isInput: boolean, portType: kevoree.PortTypeRef, comp: kevoree.Component) {
    const port = this._factory.createPort().withName(portType.name);
    port.portTypeRef = portType;
    if (isInput) {
      comp.addProvided(port);
    } else {
      comp.addRequired(port);
    }
  }

  private initDictionaries(instance: kevoree.Instance) {
    instance.dictionary = instance.dictionary || this._factory.createDictionary()
      .withGenerated_KMF_ID('0.0');
    const dicType = instance.typeDefinition!.dictionaryType;
    if (dicType) {
      dicType.attributes.array.forEach((attr) => {
        let val: kevoree.Value<kevoree.Dictionary>;
        if (!kUtils.toBoolean(attr.fragmentDependant)) {
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
          if (kUtils.isChannelType(instance.typeDefinition!)) {
            (instance as kevoree.Channel).bindings.array.forEach((binding) => {
              if (binding.port) {
                if (!instance.findFragmentDictionaryByID(binding.port.eContainer().eContainer().name)) {
                  const fragDic = this._factory.createFragmentDictionary();
                  fragDic.name = binding.port.eContainer().eContainer().name;
                  (instance as kevoree.Channel).addFragmentDictionary(fragDic);
                }
              }
            });
          } else if (kUtils.isGroupType(instance.typeDefinition!)) {
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

  private initPorts(comp: kevoree.Component) {
    const tdef = comp.typeDefinition as kevoree.ComponentType;
    tdef.provided.array.forEach((portType) => this.createPort(true, portType, comp));
    tdef.required.array.forEach((portType) => this.createPort(false, portType, comp));
  }

  get model() {
    return this._model;
  }

  get nodes() {
    return this._model.nodes.array;
  }

  get selectedNodes() {
    return this.nodes.filter(kUtils.isSelected);
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