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
  
  @observable private _path: string = '/';
  @observable private _previousPath: string | null = null;
  @observable private _engine: DiagramEngine = new DiagramEngine();
  @observable private _model: DiagramModel = new DiagramModel();
  @observable private _smartRouting = false;

  constructor(kService: KevoreeService) {
    this._kService = kService;

    this.initModel();

    this._engine.registerNodeFactory(new KevoreeComponentFactory());
    this._engine.registerNodeFactory(new KevoreeNodeFactory());
    this._engine.registerNodeFactory(new KevoreeChannelFactory());
    this._engine.registerNodeFactory(new KevoreeGroupFactory());
    this._engine.registerPortFactory(new KevoreePortFactory());
    this._engine.registerLinkFactory(new KevoreeLinkFactory());
    this._engine.registerLabelFactory(new DefaultLabelFactory());
    this._engine.setDiagramModel(this._model);

    // listen to kevoreeService model changing (ie. when ref to kevoree.Model changes)
    kService.addListener(this);

    // listen to model changes (ie. add/remove nodes, groups, etc)
    this.registerModelListener();
  }

  @action addNode(node: kevoree.Node) {
    this._model.addNode(new KevoreeNodeModel(node));
  }

  @action addComponent(comp: kevoree.Component) {
    this._model.addNode(new KevoreeComponentModel(comp));
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
      this.removeModelListener();
      this._previousPath = this._path;
      this._path = path;
      const prevZoomLevel = this._model.getZoomLevel(); 
      this._model = new DiagramModel();
      this.initModel(prevZoomLevel);
      this._engine.setDiagramModel(this._model);
      this.updateDiagram(elem);
      this.registerModelListener();
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
    console.log('DiagramStore listener', event);
    switch (event.etype.name$) {
      case 'ADD':
        if (event.elementAttributeName === 'nodes') {
          this.addNode(event.value as kevoree.Node);
        } else if (event.elementAttributeName === 'groups') {
          this.addGroup(event.value as kevoree.Group);
        } else if (event.elementAttributeName === 'hubs') {
          this.addChannel(event.value as kevoree.Channel);
        } else if (event.elementAttributeName === 'components') {
          this.addComponent(event.value as kevoree.Component);
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

  private registerModelListener() {
    const elem = this._kService.model.findByPath(this._path);
    if (elem) {
      elem.addModelElementListener(this);
    }
  }

  private removeModelListener() {
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
      (elem as kevoree.Node).components.array.forEach((comp) => this.addComponent(comp));
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