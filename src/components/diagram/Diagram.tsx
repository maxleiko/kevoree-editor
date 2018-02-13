import * as React from 'react';
import {
  DiagramEngine, DiagramWidget, BaseAction, MoveItemsAction, DiagramModel
} from 'storm-react-diagrams';

import { KevoreeEngine } from '../../KevoreeEngine';
import { Hoverlay } from '../hoverlay';
import { DND_ITEM } from '../../utils/constants';
import { distributeElements } from '../../utils/dagreify';

import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';

import './Diagram.css';

interface DiagramProps {
  diagramEngine: DiagramEngine;
  kevoreeEngine: KevoreeEngine;
  onDrop: (tdef: k.TypeDefinition, point: { x: number, y: number }) => void;
}
interface DiagramState {}

export class Diagram extends React.Component<DiagramProps, DiagramState> {

  onDrop(event: React.DragEvent<HTMLElement>) {
    try {
      const point = this.props.diagramEngine.getRelativeMousePoint(event);
      const tdef: k.TypeDefinition = JSON.parse(event.dataTransfer.getData(DND_ITEM));
      this.props.onDrop(tdef, point);
    } catch (ignore) {/* noop */}
  }

  onActionStarted(action: BaseAction) {
    if (action instanceof MoveItemsAction) {
      // move instance action started
      action.selectionModels.forEach((model) => {
        // tslint:disable-next-line
        console.log('MoveItemsAction', model);
      });
    }
    return true;
  }

  onActionStopped(action: BaseAction) {
    if (action instanceof MoveItemsAction) {
      // move instance action stopped
      // TODO: check if component should be moved to another node
    }
    return true;
  }

  autoLayout() {
    const model = this.props.diagramEngine.getDiagramModel();
    const serialized = model.serializeDiagram();
    // tslint:disable-next-line
    console.log(serialized);
    const distributedSerializedDiagram = distributeElements(serialized);
    // deserialize the model
    let deSerializedModel = new DiagramModel();
    deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, this.props.diagramEngine);
    this.props.diagramEngine.setDiagramModel(deSerializedModel);
    this.props.diagramEngine.repaintCanvas();
  }

  zoomIn() {
    const model = this.props.diagramEngine.getDiagramModel();
    model.setZoomLevel(model.getZoomLevel() + 10);
    this.props.diagramEngine.repaintCanvas();
  }

  zoomOut() {
    const model = this.props.diagramEngine.getDiagramModel();
    model.setZoomLevel(model.getZoomLevel() - 10);
    this.props.diagramEngine.repaintCanvas();
  }

  componentDidMount() {
    this.props.diagramEngine.getDiagramModel().setZoomLevel(150);
  }

  generateOverlay() {
    return (
      <DiagramOverlay>
        <OverlayIcon name="Auto layout" onClick={() => this.autoLayout()} icon="fa fa-2x fa-th" />
        <OverlayIcon name="Zoom in" onClick={() => this.zoomIn()} icon="fa fa-2x fa-search-plus" />
        <OverlayIcon name="Zoom out" onClick={() => this.zoomOut()} icon="fa fa-2x fa-search-minus" />
      </DiagramOverlay>
    );
  }

  render() {
    return (
      <div
        className="Diagram"
        onDrop={(event) => this.onDrop(event)}
        onDragOver={(event) => event.preventDefault()}
      >
        <Hoverlay overlay={this.generateOverlay()}>
          <DiagramWidget
            diagramEngine={this.props.diagramEngine}
            inverseZoom={true}
            allowLooseLinks={false}
            actionStartedFiring={(action) => this.onActionStarted(action)}
            actionStoppedFiring={(action) => this.onActionStopped(action)}
          />
        </Hoverlay>
      </div>
    );
  }
}
