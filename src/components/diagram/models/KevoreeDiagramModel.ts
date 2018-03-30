import { observable, action } from 'mobx';
import {
  DiagramModel,
  LinkModel,
  NodeModel,
  BaseModel,
  BaseEntity,
  BaseModelListener,
} from 'storm-react-diagrams';

export class KevoreeDiagramModel extends DiagramModel {
  @observable links: { [s: string]: LinkModel } = {};
  @observable nodes: { [s: string]: NodeModel } = {};

  @observable offsetX: number = 0;
  @observable offsetY: number = 0;
  @observable zoom: number = 100;
  @observable rendered: boolean = false;
  @observable gridSize: number = 0;

  @action
  setGridSize(size: number = 0) {
    return super.setGridSize(size);
  }

  @action
  clearSelection(ignore: BaseModel<BaseEntity, BaseModelListener> | null = null) {
    return super.clearSelection(ignore);
  }

  @action
  setZoomLevel(zoom: number) {
    super.setZoomLevel(zoom);
  }

  @action
  setOffset(offsetX: number, offsetY: number) {
    super.setOffset(offsetX, offsetY);
  }

  @action
  setOffsetX(offsetX: number) {
    super.setOffsetX(offsetX);
  }

  @action
  setOffsetY(offsetY: number) {
    super.setOffsetY(offsetY);
  }
  
  @action
  addAll(...models: BaseModel[]): BaseModel[] {
    return super.addAll(...models);
  }

  @action
  addLink(link: LinkModel): LinkModel {
    return super.addLink(link);
  }

  @action
  addNode(node: NodeModel): NodeModel {
    return super.addNode(node);
  }

  @action
  removeLink(link: LinkModel | string) {
    return super.removeLink(link);
  }

  @action
  removeNode(node: NodeModel | string) {
    return super.removeNode(node);
  }
}

// export class KevoreeDiagramModel extends DiagramModel {
//   @observable private _links: { [s: string]: LinkModel } = {};
//   @observable private _nodes: { [s: string]: NodeModel } = {};
//   @observable private _offsetX: number = 0;
//   @observable private _offsetY: number = 0;
//   @observable private _zoom: number = 100;
//   @observable private _rendered: boolean = false;
//   @observable private _gridSize: number = 0;

//   @action
//   setGridSize(size: number = 0) {
//     this._gridSize = size;
//     this.iterateListeners((listener, event) => {
//       if (listener.gridUpdated) {
//         listener.gridUpdated({ ...event, size: size });
//       }
//     });
//   }

//   getGridPosition(pos: any) {
//     if (this._gridSize === 0) {
//       return pos;
//     }
//     return this._gridSize * Math.floor((pos + this._gridSize / 2) / this._gridSize);
//   }

//   @action
//   deSerializeDiagram(object: any, diagramEngine: DiagramEngine) {
//     super.deSerializeDiagram(object, diagramEngine);
//   }

//   @action
//   clearSelection(ignore: BaseModel<BaseEntity, BaseModelListener> | null = null) {
//     _.forEach(this.getSelectedItems(), (element) => {
//       if (ignore && ignore.getID() === element.getID()) {
//         return;
//       }
//       element.setSelected(false);
//     });
//   }

//   @computed
//   getSelectedItems(...filters: BaseEntityType[]): BaseModel<BaseEntity, BaseModelListener>[] {
//     return super.getSelectedItems(...filters);
//   }

//   @action
//   setZoomLevel(zoom: number) {
//     this._zoom = zoom;
//   }

//   @action
//   setOffset(offsetX: number, offsetY: number) {
//     this._offsetX = offsetX;
//     this._offsetY = offsetY;
//   }

//   @action
//   setOffsetX(offsetX: number) {
//     this._offsetX = offsetX;
//   }

//   @action
//   setOffsetY(offsetY: number) {
//     this._offsetY = offsetY;
//   }

//   @computed
//   get offsetY() {
//     return this._offsetY;
//   }

//   set offsetY(val: number) {
//     this._offsetY = val;
//   }

//   @computed
//   get offsetX() {
//     return this._offsetX;
//   }

//   set offsetX(val: number) {
//     this._offsetX = val;
//   }

//   @computed
//   get zoomLevel() {
//     return this._zoom;
//   }

//   set zoomLevel(val: number) {
//     this.zoom = val;
//   }

//   @computed
//   get rendered() {
//     return this._rendered;
//   }

//   set rendered(val: boolean) {
//     this._rendered = val;
//   }

//   @computed
//   get gridSize() {
//     return this._gridSize;
//   }

//   set gridSize(val: number) {
//     this._gridSize = val;
//   }

//   @computed
//   getNode(node: string | NodeModel): NodeModel | null {
//     return super.getNode(node);
//   }

//   @computed
//   getLink(link: string | LinkModel): LinkModel | null {
//     return super.getLink(link);
//   }

//   @action
//   addAll(...models: BaseModel[]): BaseModel[] {
//     return super.addAll(...models);
//   }

//   @action
//   addLink(link: LinkModel): LinkModel {
//     return super.addLink(link);
//   }

//   @action
//   addNode(node: NodeModel): NodeModel {
//     return super.addNode(node);
//   }

//   @action
//   removeLink(link: LinkModel | string) {
//     super.removeLink(link);
//   }

//   @action
//   removeNode(node: NodeModel | string) {
//     super.removeNode(node);
//   }

//   @computed
//   get links() {
//     return this._links;
//   }

//   set links(links: { [s: string]: LinkModel }) {
//     this._links = links;
//   }

//   @computed
//   get nodes() {
//     return this._nodes;
//   }

//   set nodes(nodes: { [s: string]: NodeModel }) {
//     this._nodes = nodes;
//   }
// }
