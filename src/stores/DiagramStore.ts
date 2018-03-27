import { observable, action, computed } from 'mobx';
import { DiagramModel, DiagramEngine, DefaultLabelFactory } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';

import { KevoreeService, KevoreeServiceListener } from '../services';
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
} from '../components/diagram/models';
import { isNode, isModel } from '../utils/kevoree';
import { DIAGRAM_DEFAULT_ZOOM } from '../utils/constants';
import { AdaptationEngine, NodeAdaptationEngine, ModelAdaptationEngine } from '../adaptations';

export class DiagramStore implements KevoreeServiceListener, kevoree.KevoreeModelListener {

  private _kService: KevoreeService;
  private _kListenerUid: string;
  private _modelAdaptEngine: AdaptationEngine<kevoree.Model> = new ModelAdaptationEngine(this);
  private _nodeAdaptEngine: AdaptationEngine<kevoree.Node> = new NodeAdaptationEngine(this);
  
  @observable private _path: string = '/';
  @observable private _previousPath: string | null = null;
  @observable private _engine: DiagramEngine = new DiagramEngine();
  @observable private _model: DiagramModel = new DiagramModel();
  @observable private _smartRouting = false;

  constructor(_kService: KevoreeService) {
    this._kService = _kService;

    // register custom factories
    this._engine.registerNodeFactory(new KevoreeComponentFactory(this._kService));
    this._engine.registerNodeFactory(new KevoreeNodeFactory(this._kService));
    this._engine.registerNodeFactory(new KevoreeChannelFactory(this._kService));
    this._engine.registerNodeFactory(new KevoreeGroupFactory(this._kService));
    this._engine.registerPortFactory(new KevoreePortFactory());
    this._engine.registerPortFactory(new KevoreeChannelPortFactory());
    this._engine.registerLinkFactory(new KevoreeLinkFactory());
    this._engine.registerLabelFactory(new DefaultLabelFactory());

    // set model
    this._engine.setDiagramModel(this._model);

    // listen to this._kService model changing (ie. when ref to kevoree.Model changes)
    this._kService.addListener(this);

    // init
    this.changePath(this._path);
    this._previousPath = null;
  }

  @action addNode(node: kevoree.Node) {
    const vm = new KevoreeNodeModel(node);
    this._model.addNode(vm);
    return vm;
  }

  @action addComponent(comp: kevoree.Component) {
    const vm = new KevoreeComponentModel(comp);
    this._model.addNode(vm);
    return vm;
  }

  @action addChannel(chan: kevoree.Channel) {
    const vm = new KevoreeChannelModel(chan);
    this._model.addNode(vm);
    return vm;
  }

  @action addGroup(group: kevoree.Group) {
    const vm = new KevoreeGroupModel(group);
    this._model.addNode(vm);
    return vm;
  }

  @action addBinding(binding: kevoree.Binding) {
    const vm = new KevoreeLinkModel();
    if (binding.port && binding.hub) {
      const compVM = this._model.getNode(binding.port.eContainer().path()) as KevoreeComponentModel;
      const portVM = compVM.getPortFromID(binding.port.path());
      if (portVM) {
        vm.setSourcePort(portVM);
        const chanVM = this._model.getNode(binding.hub.path()) as KevoreeChannelModel;
        if (chanVM) {
          const chanPortVM = binding.port.getRefInParent() === 'provided'
            ? chanVM.getInputs()
            : chanVM.getOutputs();
          vm.setTargetPort(chanPortVM);
          this._model.addLink(vm);
        }
      }
    }
    return vm;
  }

  @action changePath(path: string) {
    const elem = this._kService.model.findByPath(path);
    if (elem) {
      this.removeListeners();
      this._previousPath = this._path;
      this._path = path;
      const prevZoomLevel = this._model.getZoomLevel();
      this._model = new DiagramModel();
      if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line
        window['diagram'] = this._engine;
      }
      this.initModel(prevZoomLevel);
      this._engine.setDiagramModel(this._model);
      this.registerListeners();
      this.updateDiagram(elem);
      this._engine.repaintCanvas();
    } else {
      throw new Error(`Unable to find "${path}" in the Kevoree model`);
    }
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
    this._model.setZoomLevel(this._model.getZoomLevel() + 10);
    this._engine.repaintCanvas();
  }

  @action zoomOut() {
    this._model.setZoomLevel(this._model.getZoomLevel() - 10);
    this._engine.repaintCanvas();
  }

  @action zoomToFit() {
    this._engine.zoomToFit();
  }

  @action autoLayout() {
    distributeElements(this._model);
    this._engine.repaintCanvas();
  }

  @action elementChanged(event: kevoree.ModelEvent) {
    const elem = this._kService.model.findByPath(this._path);
    if (elem) {
      let update = false;
      if (isNode(elem)) {
        update = this._nodeAdaptEngine.adapt(event);
        if (process.env.NODE_ENV !== 'production' && update) {
          // tslint:disable-next-line
          console.log('=== NodeAdaptationEngine ===', event);
        }
      } else if (isModel(elem)) {
        update = this._modelAdaptEngine.adapt(event);
        if (process.env.NODE_ENV !== 'production' && update) {
          // tslint:disable-next-line
          console.log('=== ModelAdaptationEngine ===', event);
        }
      } else {
        throw new Error(`TODO add elementChanged behavior for type ${elem.path()} in DiagramStore`);
      }
      if (update) {
        this._engine.repaintCanvas();
      }
    }
  }

  @action modelChanged() {
    this.changePath('/');
    this._previousPath = null;
  }

  private registerListeners() {
    this.registerDiagramModelListener();
    this.registerKevoreeModelListener();
  }

  private removeListeners() {
    this.removeDiagramModelListener();
    this.removeKevoreeModelListener();
  }

  private registerDiagramModelListener() {
    this._kListenerUid = this._model.addListener(this._kService);
  }

  private removeDiagramModelListener() {
    this._model.removeListener(this._kListenerUid);
  }

  private registerKevoreeModelListener() {
    this._kService.model.addModelTreeListener(this);
  }

  private removeKevoreeModelListener() {
    this._kService.model.removeModelTreeListener(this);
  }

  private initModel(zoomLevel: number = DIAGRAM_DEFAULT_ZOOM) {
    this._model.setZoomLevel(zoomLevel);
  }

  @action private updateDiagram(elem: kevoree.Klass<any>) {
    if (isNode(elem)) {
      this._nodeAdaptEngine.createInstances(elem as kevoree.Node);
    } else if (isModel(elem)) {
      this._modelAdaptEngine.createInstances(elem as kevoree.Model);
    } else {
      throw new Error(`TODO add updateDiagram behavior for type ${elem.path()} in DiagramStore`);
    }
  }

  @computed get path() {
    return this._path;
  }

  @computed get previousPath() {
    return this._previousPath;
  }

  @computed get engine() {
    return this._engine;
  }

  @computed get model() {
    return this._model;
  }

  @computed get smartRouting() {
    return this._smartRouting;
  }
}