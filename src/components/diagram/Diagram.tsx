import * as React from 'react';
import {
  DiagramWidget, BaseAction, MoveItemsAction, DiagramModel
} from 'storm-react-diagrams';
import { observer, inject } from 'mobx-react';

import { KevoreeStore } from '../../stores/KevoreeStore';
import { Hoverlay } from '../hoverlay';
import { DND_ITEM } from '../../utils/constants';
import { distributeElements } from '../../utils/dagreify';

import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';

import './Diagram.css';

interface DiagramProps {
  kevoreeStore?: KevoreeStore;
}

@inject('kevoreeStore')
@observer
export class Diagram extends React.Component<DiagramProps, {}> {

  onDrop(event: React.DragEvent<HTMLElement>) {
    try {
      const point = this.props.kevoreeStore!.diagram.getRelativeMousePoint(event);
      const tdefPath = event.dataTransfer.getData(DND_ITEM);
      this.props.kevoreeStore!.createInstance(tdefPath, point);
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
    const model = this.props.kevoreeStore!.diagram.getDiagramModel();
    const serialized = model.serializeDiagram();
    // tslint:disable-next-line
    console.log(serialized);
    const distributedSerializedDiagram = distributeElements(serialized);
    // deserialize the model
    let deSerializedModel = new DiagramModel();
    deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, this.props.kevoreeStore!.diagram);
    this.props.kevoreeStore!.diagram.setDiagramModel(deSerializedModel);
    this.props.kevoreeStore!.diagram.repaintCanvas();
  }

  zoomIn() {
    const model = this.props.kevoreeStore!.diagram.getDiagramModel();
    model.setZoomLevel(model.getZoomLevel() + 10);
    this.props.kevoreeStore!.diagram.repaintCanvas();
  }

  zoomOut() {
    const model = this.props.kevoreeStore!.diagram.getDiagramModel();
    model.setZoomLevel(model.getZoomLevel() - 10);
    this.props.kevoreeStore!.diagram.repaintCanvas();
  }

  zoomToFit() {
    this.props.kevoreeStore!.diagram.zoomToFit();
  }

  componentDidMount() {
    this.props.kevoreeStore!.diagram.getDiagramModel().setZoomLevel(150);
  }

  generateOverlay() {
    return (
      <DiagramOverlay>
        <OverlayIcon name="Zoom in" onClick={() => this.zoomIn()} icon="fa fa-2x fa-search-plus" />
        <OverlayIcon name="Zoom out" onClick={() => this.zoomOut()} icon="fa fa-2x fa-search-minus" />
        <OverlayIcon name="Zoom to fit" onClick={() => this.zoomToFit()} icon="fa fa-2x fa-search" />
        <OverlayIcon name="Auto layout" onClick={() => this.autoLayout()} icon="fa fa-2x fa-th" />
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
            diagramEngine={this.props.kevoreeStore!.diagram}
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
