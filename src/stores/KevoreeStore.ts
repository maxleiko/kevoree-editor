import * as _ from 'lodash';
import { observable, computed, action, autorun } from 'mobx';
import {
  Model,
  Instance,
  Node,
  ComponentType,
  ChannelType,
  GroupType,
  NodeType,
  TypeDefinition,
  Namespace,
  Value,
  Port,
  Component,
  Channel,
  Group,
  PortType,
  JSONKevoreeLoader,
} from 'kevoree-ts-model';
import {
  DiagramEngine,
  DefaultLabelFactory,
} from '@leiko/react-diagrams';
import { ITypeDefinition, INamespace } from 'kevoree-registry-client';

import { distributeElements } from '../utils/dagreify';
import {
  KevoreeNodeFactory,
  KevoreeComponentFactory,
  KevoreeChannelFactory,
  KevoreeGroupFactory,
  KevoreeChannelPortFactory,
  KevoreeLinkFactory,
} from '../components/diagram/factories';
import { KevoreeDiagramModel, KevoreeNodeModel } from '../components/diagram/models';
import * as kUtils from '../utils/kevoree';
import { KevoreePortFactory } from '../components/diagram/factories/KevoreePortFactory';

export class KevoreeStore {
  @observable private _currentPath: string = '/';
  @observable private _previousPath: string | null = null;
  @observable private _engine = new DiagramEngine();
  @observable private _model = new Model();

  constructor() {
    // register custom factories
    this._engine.registerNodeFactory(new KevoreeComponentFactory(this));
    this._engine.registerNodeFactory(new KevoreeNodeFactory(this));
    this._engine.registerNodeFactory(new KevoreeChannelFactory(this));
    this._engine.registerNodeFactory(new KevoreeGroupFactory(this));
    this._engine.registerPortFactory(new KevoreeChannelPortFactory());
    this._engine.registerLinkFactory(new KevoreeLinkFactory());
    this._engine.registerPortFactory(new KevoreePortFactory());
    // default factories
    this._engine.registerLabelFactory(new DefaultLabelFactory());

    this.changePath('/');
    this._previousPath = null;

    if (process.env.NODE_ENV !== 'production') {
      autorun(r => {
        // tslint:disable-next-line
        console.log('[[UPDATE]] Kevoree "model" and UI "diagram" are available in window object');
        // tslint:disable-next-line
        window['model'] = this._model;
        // tslint:disable-next-line
        window['diagram'] = this._engine.model;
      });
    }
  }

  @action
  changePath(path: string) {
    const elem = this._model.getByPath(path);
    if (elem) {
      if (elem instanceof Node || elem instanceof Model) {
        this._previousPath = this._currentPath;
        this._currentPath = path;
        const prevZoomLevel = this._engine.model.zoom;
        const model = new KevoreeDiagramModel(elem);
        model.zoom = prevZoomLevel;
        this._engine.model = model;
      } else {
        throw new Error(`Change path can only be made to Model or Nodes (not "${path}")`);
      }
    } else {
      throw new Error(`Unable to find "${path}" in the Kevoree model`);
    }
  }

  @action
  serialize(): string {
    return JSON.stringify(this._model, null, 2);
  }

  @action
  deserialize(dataStr: string): void {
    this._model = new JSONKevoreeLoader().parse(dataStr);
    this._model.groups.forEach((g) => this.initDictionaries(g));
    this._model.channels.forEach((c) => this.initDictionaries(c));
    this._model.nodes.forEach((n) => {
      this.initDictionaries(n);
      n.components.forEach((c) => {
        this.initDictionaries(c);
        this.initPorts(c);
      });
    });
    this.modelChanged();
  }

  @action
  createInstance(
    rTdef: ITypeDefinition,
    point: kwe.Point = { x: 100, y: 100 },
    event?: MouseEvent
  ) {
    const tdef = this.findOrCreateTypeDefinition(rTdef);
    const dModel = this._engine.model as KevoreeDiagramModel;
    if (this.currentElem instanceof Node) {
      if (tdef instanceof ComponentType) {
        const comp = this.createComponent(tdef, this.currentElem, point);
        dModel.addKevoreeComponent(comp);
        return comp;
      } else if (tdef instanceof ChannelType) {
        const chan = this.createChannel(tdef, this._model, point);
        dModel.addKevoreeChannel(chan);
        return chan;
      } else if (tdef instanceof GroupType) {
        const group = this.createGroup(tdef, this._model, point);
        dModel.addKevoreeGroup(group);
        return group;
      } else if (tdef instanceof NodeType) {
        throw new Error('Nodes must be added to model root');
      } else {
        const typeName = `${rTdef.namespace!}.${rTdef.name}/${rTdef.version}`;
        throw new Error(
          `Unable to create instance of unknown type "${typeName}"`
        );
      }
    } else {
      if (tdef instanceof ComponentType) {
        if (event) {
          // if "event" is set: it's a drop event
          const { model } = this._engine.getModelAtPosition(event);
          if (model && model instanceof KevoreeNodeModel) {
            return this.createComponent(tdef, model.instance, point);
          }
          throw new Error('Components must be added in Nodes');
        }
        if (this.selectedNodes.length > 0) {
          return this.selectedNodes.map((node) => this.createComponent(tdef, node, point));
        }
        throw new Error('Components must be added in Nodes');
      } else if (tdef instanceof ChannelType) {
        const chan = this.createChannel(tdef, this.currentElem as Model, point);
        dModel.addKevoreeChannel(chan);
        return chan;
      } else if (tdef instanceof GroupType) {
        const group = this.createGroup(tdef, this.currentElem as Model, point);
        dModel.addKevoreeGroup(group);
        return group;
      } else if (tdef instanceof NodeType) {
        const node = this.createNode(tdef, this.currentElem as Model, point);
        dModel.addKevoreeNode(node);
        return node;
      } else {
        const typeName = `${rTdef.namespace!}.${rTdef.name}/${rTdef.version}`;
        throw new Error(
          `Unable to create instance of unknown type "${typeName}"`
        );
      }
    }
  }

  @action
  updateNamespaces(nss: INamespace[]) {
    nss
      .filter(ns => this._model.getNamespace(ns.name) === null)
      .map(ns => new Namespace().withName(ns.name))
      .forEach(ns => {
        // tslint:disable-next-line
        console.log('Adding namespace', ns.toJSON());
        this._model.addNamespace(ns);
      });
  }

  @action
  updateTypeDefinitions(namespace: string, rTdefs: ITypeDefinition[]) {
    // create namespace if necessary
    this.updateNamespaces([{ name: namespace }]);

    // get namespace from model
    const ns = this._model.getNamespace(namespace);

    if (ns) {
      const loader = new JSONKevoreeLoader();
      rTdefs
        .map(tdef => loader.parseKMF<TypeDefinition>(tdef.model))
        .forEach(tdef => ns.addTdef(tdef));
    }
    throw new Error(`Unable to find namespace "${namespace}" in model`);
  }

  @action.bound
  previousView() {
    if (this._previousPath) {
      this.changePath(this._previousPath);
      this._previousPath = null;
    }
  }

  @action.bound
  toggleSmartRouting() {
    this._engine.model.smartRouting = !this._engine.model.smartRouting;
  }

  @action.bound
  zoomIn() {
    this._engine.model.zoom = this._engine.model.zoom + 10;
  }

  @action.bound
  zoomOut() {
    this._engine.model.zoom = this._engine.model.zoom - 10;
  }

  @action.bound
  fitContent() {
    this.engine.fitContent();
  }

  @action.bound
  autoLayout() {
    distributeElements(this._engine.model);
  }

  @action
  modelChanged() {
    this.changePath('/');
    this._previousPath = null;
  }

  @action
  private findOrCreateTypeDefinition({
    namespace,
    name,
    version,
    model
  }: ITypeDefinition): TypeDefinition {
    let ns = this._model.getNamespace(namespace!);
    if (!ns) {
      ns = new Namespace().withName(namespace!);
      this._model.addNamespace(ns);
    }

    let tdef = ns.getTdef(`${name}:${version}`);
    if (!tdef) {
      tdef = new JSONKevoreeLoader().parseKMF<TypeDefinition>(model);
      ns.addTdef(tdef);
    }
    return tdef;
  }

  private createComponent(
    tdef: ComponentType,
    container: Node,
    point: kwe.Point
  ) {
    const instance = new Component();
    instance.name = this.genCompName(container);
    instance.tdef = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    this.initPorts(instance);
    container.addComponent(instance);
    return instance;
  }

  private createNode(tdef: NodeType, container: Model, point: kwe.Point) {
    const instance = new Node();
    instance.name = this.genNodeName(container);
    instance.tdef = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addNode(instance);
    return instance;
  }

  private createChannel(tdef: ChannelType, container: Model, point: kwe.Point) {
    const instance = new Channel();
    instance.name = this.genChanName(container);
    instance.tdef = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addChannel(instance);
    return instance;
  }

  private createGroup(tdef: GroupType, container: Model, point: kwe.Point) {
    const instance = new Group();
    instance.name = this.genGroupName(container);
    instance.tdef = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addGroup(instance);
    return instance;
  }

  private createPort(isInput: boolean, portType: PortType, comp: Component) {
    const port = new Port().withName(portType.name!);
    if (isInput) {
      comp.addInput(port);
    } else {
      comp.addOutput(port);
    }
  }

  private initDictionaries(instance: Instance) {
    instance.tdef!.dictionary.forEach(paramType => {
      let val: Value<Instance> | undefined;
      if (!paramType.fragmentDependant) {
        // attribute is not fragment dependant
        val = instance.getParam(paramType.name!);
        if (!val) {
          val = new Value<Instance>();
          val.name = paramType.name;
          val.value = paramType.defaultValue;
          instance.addParam(val);
        }
      } else {
        // attribute is fragment dependant
        // create fragment dictionaries if needed
        // TODO
        // if (instance instanceof Channel) {
        //   instance.bindings.forEach((binding) => {
        //     if (binding.port) {
        //       if (!instance.findFragmentDictionaryByID(binding.port.eContainer().eContainer().name)) {
        //         const fragDic = this._factory.createFragmentDictionary();
        //         fragDic.name = binding.port.eContainer().eContainer().name;
        //         instance.addFragmentDictionary(fragDic);
        //       }
        //     }
        //   });
        // } else if (instance instanceof Group) {
        //   instance.nodes.forEach((node) => {
        //     if (!instance.findFragmentDictionaryByID(node.name)) {
        //       const fragDic = this._factory.createFragmentDictionary();
        //       fragDic.name = node.name;
        //       instance.addFragmentDictionary(fragDic);
        //     }
        //   });
        // }
        // // add default value to fragment dictionaries that does not already have them
        // instance.fragmentDictionary.array.forEach((fDic) => {
        //   val = fDic.findValuesByID(paramType.name);
        //   if (!val) {
        //     val = this._factory.createValue();
        //     val.name = paramType.name;
        //     val.value = paramType.defaultValue;
        //     fDic.addValues(val);
        //   }
        // });
      }
    });
  }

  private initPorts(comp: Component) {
    if (comp.tdef) {
      // create port only if necessary
      comp.tdef.inputs
        .filter((portType) => comp.getInput(portType.name!) === undefined)
        .forEach((portType) => this.createPort(true, portType, comp));
      comp.tdef.outputs
        .filter((portType) => comp.getOutput(portType.name!) === undefined)
        .forEach((portType) => this.createPort(false, portType, comp));
    }
    // TODO handle case where tdef is null?
  }

  private genCompName(node: Node): string {
    let count = 0;
    let name = `comp${count}`;
    while (node.getComponent(name)) {
      name = `comp${++count}`;
    }
    return name;
  }

  private genNodeName(model: Model): string {
    let count = 0;
    let name = `node${count}`;
    while (model.getNode(name)) {
      name = `node${++count}`;
    }
    return name;
  }

  private genChanName(model: Model): string {
    let count = 0;
    let name = `chan${count}`;
    while (model.getChannel(name)) {
      name = `chan${++count}`;
    }
    return name;
  }

  private genGroupName(model: Model): string {
    let count = 0;
    let name = `group${count}`;
    while (model.getGroup(name)) {
      name = `groupnode${++count}`;
    }
    return name;
  }

  @computed
  get engine() {
    return this._engine;
  }

  @computed
  get model() {
    return this._model;
  }

  @computed
  get currentPath() {
    return this._currentPath;
  }

  @computed
  get currentElem() {
    // TODO non-null assertion might be risky for synced models
    return this._model.getByPath(this._currentPath)!;
  }

  @computed
  get previousPath() {
    return this._previousPath;
  }

  @computed
  get selection() {
    let selection: Instance[] = [];

    if (this.currentElem) {
      if (this.currentElem instanceof Node) {
        const node = this.currentElem;
        selection = selection
          .concat(node.components)
          .concat(
            node.parent!.bindings.filter(
              b =>
                b.port &&
                b.channel &&
                b.port.parent &&
                node.components.find(c => c.path === b.port!.parent!.path)
            ).map((b) => b.channel!)
          );
      } else if (this.currentElem instanceof Model) {
        selection = selection
          .concat(this.currentElem.nodes)
          .concat(this.currentElem.groups)
          .concat(this.currentElem.channels);
      }
    }
    return _.uniqBy(selection.filter(kUtils.isSelected), (elem) => elem.path);
  }

  @computed
  get selectedNodes() {
    return this.selection.filter(function isNode(elem: Instance): elem is Node {
      return elem instanceof Node;
    });
  }
}
