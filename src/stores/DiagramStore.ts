import { observable, action, computed } from 'mobx';
import { DiagramModel, DiagramEngine, DefaultLabelFactory } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';

import { distributeElements } from '../utils/dagreify';
import {
  KevoreeNodeFactory,
  KevoreeComponentFactory,
  KevoreeChannelFactory,
  KevoreeGroupFactory,
  KevoreePortFactory,
  KevoreeLinkFactory,
} from '../components/diagram/factories';
import {
  KevoreeNodeModel,
  KevoreeComponentModel,
  KevoreeChannelModel,
  KevoreeGroupModel
} from '../components/diagram/models';
import { KevoreeService, KevoreeServiceListener } from '../services/KevoreeService';
import { isNode, isModel } from '../utils/kevoree';
import { DIAGRAM_DEFAULT_ZOOM } from '../utils/constants';

export class DiagramStore implements KevoreeServiceListener, kevoree.KevoreeModelListener {

  private _kService: KevoreeService;
  private _kListenerUid: string;
  
  @observable private _path: string = '/';
  @observable private _previousPath: string | null = null;
  @observable private _engine: DiagramEngine = new DiagramEngine();
  @observable private _model: DiagramModel = new DiagramModel();
  @observable private _smartRouting = false;

  constructor(kService: KevoreeService) {
    this._kService = kService;

    this._engine.registerNodeFactory(new KevoreeComponentFactory(kService));
    this._engine.registerNodeFactory(new KevoreeNodeFactory(kService));
    this._engine.registerNodeFactory(new KevoreeChannelFactory(kService));
    this._engine.registerNodeFactory(new KevoreeGroupFactory(kService));
    this._engine.registerPortFactory(new KevoreePortFactory());
    this._engine.registerLinkFactory(new KevoreeLinkFactory());
    this._engine.registerLabelFactory(new DefaultLabelFactory());
    this._engine.setDiagramModel(this._model);

    // listen to kevoreeService model changing (ie. when ref to kevoree.Model changes)
    kService.addListener(this);

    // init
    this.changePath(this._path);
    this._previousPath = null;
  }

  @action addNode(node: kevoree.Node) {
    const vm = new KevoreeNodeModel(node);
    this._model.addNode(vm);
  }

  @action addComponent(comp: kevoree.Component) {
    const vm = new KevoreeComponentModel(comp);
    this._model.addNode(vm);
  }

  @action addChannel(chan: kevoree.Channel) {
    this._model.addNode(new KevoreeChannelModel(chan));
  }

  @action addGroup(group: kevoree.Group) {
    this._model.addNode(new KevoreeGroupModel(group));
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
    // tslint:disable-next-line
    console.log('=== KEVOREE MODEL EVENT ===', event);
    switch (event.etype.name$) {
      case 'ADD':
        if (event.elementAttributeName === 'nodes') {
          const node = event.value as kevoree.Node;
          this.addNode(node);
        } else if (event.elementAttributeName === 'groups') {
          this.addGroup(event.value as kevoree.Group);
        } else if (event.elementAttributeName === 'hubs') {
          this.addChannel(event.value as kevoree.Channel);
        } else if (event.elementAttributeName === 'components') {
          this.addComponent(event.value as kevoree.Component);
        }
        // TODO handle other cases
        break;

      case 'REMOVE':
        switch (event.elementAttributeName) {
          case 'nodes':
          case 'groups':
          case 'hubs':
          case 'components':
            const vm = this._model.getNode(event.previous_value);
            if (vm) {
              vm.remove();
            }
            break;

          default:
            break;
        }
        // TODO handle other cases
        break;

      default:
        break;
    }
    this._engine.repaintCanvas();
  }

  @action modelChanged() {
    this.changePath('/');
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
    const elem = this._kService.model.findByPath(this._path);
    if (elem) {
      elem.addModelElementListener(this);
    }
  }

  private removeKevoreeModelListener() {
    const elem = this._kService.model.findByPath(this._path);
    if (elem) {
      elem.removeModelElementListener(this);
    }
  }

  private initModel(zoomLevel: number = DIAGRAM_DEFAULT_ZOOM) {
    this._model.setZoomLevel(zoomLevel);
    // this._model.setGridSize(gridSize);
  }

  @action private updateDiagram(elem: kevoree.Klass<any>) {
    if (isNode(elem)) {
      const node = elem as kevoree.Node;
      node.components.array.forEach((comp) => this.addComponent(comp));
      const model = node.eContainer() as kevoree.Model;
      model.hubs.array.forEach((chan) => this.addChannel(chan));
    } else if (isModel(elem)) {
      const model = elem as kevoree.Model;
      model.nodes.array.forEach((node) => this.addNode(node));
      model.groups.array.forEach((group) => this.addGroup(group));
      model.hubs.array.forEach((chan) => this.addChannel(chan));
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