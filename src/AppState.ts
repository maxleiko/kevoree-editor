import { DiagramEngine } from 'storm-react-diagrams';
import { KevoreeEngine } from './KevoreeEngine';
import { observable } from 'mobx';

export class AppState {
  @observable mode: 'model'|'node';
  @observable kevoreeEngine: KevoreeEngine;
  @observable diagramEngine: DiagramEngine;

  constructor() {
    this.mode = 'model';
    this.kevoreeEngine = new KevoreeEngine();
    this.diagramEngine = new DiagramEngine();
  }
}