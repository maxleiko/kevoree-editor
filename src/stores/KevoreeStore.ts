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
  Binding
} from 'kevoree-ts-model';
import { DiagramEngine, DefaultLabelFactory } from 'storm-react-diagrams';
import { ITypeDefinition, INamespace } from 'kevoree-registry-client';

import { distributeElements } from '../utils/dagreify';
import {
  KevoreeNodeFactory,
  KevoreeComponentFactory,
  KevoreeChannelFactory,
  KevoreeGroupFactory,
  KevoreePortFactory,
  KevoreeChannelPortFactory,
  KevoreeLinkFactory,
} from '../components/diagram/factories';
import {
  KevoreeNodeModel,
  KevoreeComponentModel,
  KevoreeChannelModel,
  KevoreeGroupModel,
  KevoreeLinkModel,
  KevoreeDiagramModel,
} from '../components/diagram/models';
import * as kUtils from '../utils/kevoree';

export class KevoreeStore {
  engine: DiagramEngine = new DiagramEngine();

  @observable private _currentPath: string = '/';
  @observable private _previousPath: string | null = null;
  @observable private _smartRouting = false;
  @observable private _model: Model = new Model();
  @observable private _diagramModel = new KevoreeDiagramModel();

  constructor() {
    // register custom factories
    this.engine.registerNodeFactory(new KevoreeComponentFactory(this));
    this.engine.registerNodeFactory(new KevoreeNodeFactory(this));
    this.engine.registerNodeFactory(new KevoreeChannelFactory(this));
    this.engine.registerNodeFactory(new KevoreeGroupFactory(this));
    this.engine.registerPortFactory(new KevoreePortFactory());
    this.engine.registerPortFactory(new KevoreeChannelPortFactory());
    this.engine.registerLinkFactory(new KevoreeLinkFactory());
    this.engine.registerLabelFactory(new DefaultLabelFactory());

    // set model
    this.engine.setDiagramModel(this._diagramModel);

    this.changePath('/');
    this._previousPath = null;

    if (process.env.NODE_ENV !== 'production') {
      autorun((r) => {
        // tslint:disable-next-line
        window['model'] = this._model;
        // tslint:disable-next-line
        window['diagram'] = this._diagramModel;
      });
    }
  }

  @action
  changePath(path: string) {
    const elem = this._model.getByPath(path);
    if (elem) {
      this._previousPath = this._currentPath;
      this._currentPath = path;
      const prevZoomLevel = this._diagramModel.getZoomLevel();
      this._diagramModel = new KevoreeDiagramModel();
      this._diagramModel.setZoomLevel(prevZoomLevel);
      this.engine.setDiagramModel(this._diagramModel);
      // this.updateDiagram(elem);
      this.engine.repaintCanvas();
    } else {
      throw new Error(`Unable to find "${path}" in the Kevoree model`);
    }
  }

  @action addNode(node: Node) {
    const vm = new KevoreeNodeModel(node);
    this._diagramModel.addNode(vm);
    return vm;
  }

  @action addComponent(comp: Component) {
    const vm = new KevoreeComponentModel(comp);
    this._diagramModel.addNode(vm);
    return vm;
  }

  @action addChannel(chan: Channel) {
    const vm = new KevoreeChannelModel(chan);
    this._diagramModel.addNode(vm);
    return vm;
  }

  @action addGroup(group: Group) {
    const vm = new KevoreeGroupModel(group);
    this._diagramModel.addNode(vm);
    return vm;
  }

  @action addBinding(binding: Binding) {
    const vm = new KevoreeLinkModel();
    if (binding.port && binding.channel) {
      const compVM = this._diagramModel.getNode(binding.port.parent!.path) as KevoreeComponentModel;
      const portVM = compVM.getPortFromID(binding.port.path);
      if (portVM) {
        vm.setSourcePort(portVM);
        const chanVM = this._diagramModel.getNode(binding.channel.path) as KevoreeChannelModel;
        if (chanVM) {
          const chanPortVM = binding.port.refInParent === 'inputs'
            ? chanVM.getInputs()
            : chanVM.getOutputs();
          vm.setTargetPort(chanPortVM);
          this._diagramModel.addLink(vm);
        }
      }
    }
    return vm;
  }

  @action
  serialize(): string {
    return JSON.stringify(this._model, null, 2);
  }

  @action
  deserialize(dataStr: string): void {
    this._model = new JSONKevoreeLoader().parse(dataStr);
  }

  @action
  createInstance(
    rTdef: ITypeDefinition,
    point: kwe.Point = { x: 100, y: 100 }
  ) {
    const tdef = this.findOrCreateTypeDefinition(rTdef);
    if (this.currentElem instanceof Node) {
      if (tdef instanceof ComponentType) {
        const comp = this.createComponent(tdef, this.currentElem, point);
        this.addComponent(comp);
        this.engine.repaintCanvas();
        return comp;
      } else if (tdef instanceof ChannelType) {
        const chan = this.createChannel(tdef, this._model, point);
        this.addChannel(chan);
        this.engine.repaintCanvas();
        return chan;
      } else if (tdef instanceof GroupType) {
        const group = this.createGroup(tdef, this._model, point);
        this.addGroup(group);
        this.engine.repaintCanvas();
        return group;
      } else if (tdef instanceof NodeType) {
        throw new Error('Nodes must be added to model root');
      } else {
        const typeName = `${rTdef.namespace!}.${rTdef.name}/${rTdef.version}`;
        throw new Error(`Unable to create instance of unknown type "${typeName}"`);
      }
    } else {
      if (tdef instanceof ComponentType) {
        if (this.selectedNodes.length > 0) {
          return this.selectedNodes.map((node) => this.createComponent(tdef, node, point));
        } else {
          throw new Error('Components must be added in Nodes');
        }
      } else if (tdef instanceof ChannelType) {
        const chan = this.createChannel(tdef, this.currentElem as Model, point);
        this.addChannel(chan);
        this.engine.repaintCanvas();
        return chan;
      } else if (tdef instanceof GroupType) {
        const group = this.createGroup(tdef, this.currentElem as Model, point);
        this.addGroup(group);
        this.engine.repaintCanvas();
        return group;
      } else if (tdef instanceof NodeType) {
        const node = this.createNode(tdef, this.currentElem as Model, point);
        this.addNode(node);
        this.engine.repaintCanvas();
        return node;
      } else {
        const typeName = `${rTdef.namespace!}.${rTdef.name}/${rTdef.version}`;
        throw new Error(`Unable to create instance of unknown type "${typeName}"`);
      }
    }
  }

  @action
  updateNamespaces(nss: INamespace[]) {
    nss
      .filter((ns) => this._model.getNamespace(ns.name) === null)
      .map((ns) => new Namespace().withName(ns.name))
      .forEach((ns) => {
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
      .map((tdef) => loader.parseKMF<TypeDefinition>(tdef.model))
      .forEach((tdef) => ns.addTdef(tdef));
    }
    throw new Error(`Unable to find namespace "${namespace}" in model`);
  }

  @action previousView() {
    if (this._previousPath) {
      this.changePath(this._previousPath);
      this._previousPath = null;
    }
  }

  @action toggleSmartRouting() {
    this._smartRouting = !this._smartRouting;
  }

  @action zoomIn() {
    this._diagramModel.setZoomLevel(this._diagramModel.getZoomLevel() + 10);
    this.engine.repaintCanvas();
  }

  @action zoomOut() {
    this._diagramModel.setZoomLevel(this._diagramModel.getZoomLevel() - 10);
    this.engine.repaintCanvas();
  }

  @action zoomToFit() {
    this.engine.zoomToFit();
  }

  @action autoLayout() {
    distributeElements(this._diagramModel);
    this.engine.repaintCanvas();
  }

  @action modelChanged() {
    this.changePath('/');
    this._previousPath = null;
  }

  @action
  private findOrCreateTypeDefinition({ namespace, name, version, model }: ITypeDefinition): TypeDefinition {
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

  private createComponent(tdef: ComponentType, container: Node, point: kwe.Point) {
    const instance = new Component();
    instance.name = `comp${container.components.length}`;
    instance.tdef = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    this.initPorts(instance);
    container.addComponent(instance);
    return instance;
  }

  private createNode(tdef: NodeType, container: Model, point: kwe.Point) {
    const instance = new Node();
    instance.name = `node${this._model.nodes.length}`;
    instance.tdef = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addNode(instance);
    return instance;
  }

  private createChannel(tdef: ChannelType, container: Model, point: kwe.Point) {
    const instance = new Channel();
    instance.name = `chan${this._model.channels.length}`;
    instance.tdef = tdef;
    kUtils.setPosition(instance, point);
    this.initDictionaries(instance);
    container.addChannel(instance);
    return instance;
  }

  private createGroup(tdef: GroupType, container: Model, point: kwe.Point) {
    const instance = new Group();
    instance.name = `group${this._model.groups.length}`;
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
    instance.tdef!.dictionary.forEach((paramType) => {
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
      comp.tdef.inputs.forEach((portType) => this.createPort(true, portType, comp));
      comp.tdef.outputs.forEach((portType) => this.createPort(false, portType, comp));
    }
    // TODO handle case where tdef is null?
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
        selection = selection.concat(this.currentElem.components);
      } else if (this.currentElem instanceof Model) {
        selection = selection
          .concat(this.currentElem.nodes)
          .concat(this.currentElem.groups)
          .concat(this.currentElem.channels);
      }
    }
    return selection.filter(kUtils.isSelected);
  }

  @computed
  get selectedNodes() {
    return this.selection.filter(function isNode(elem: Instance): elem is Node {
      return elem instanceof Node;
    });
  }

  @computed
  get smartRouting() {
    return this._smartRouting;
  }
}
