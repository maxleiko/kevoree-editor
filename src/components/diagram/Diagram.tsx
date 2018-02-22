import * as React from 'react';
import { DiagramWidget, BaseAction, DiagramModel } from 'storm-react-diagrams';
import { observer, inject } from 'mobx-react';
import * as kevoree from 'kevoree-library';

import { KevoreeService } from '../../services/KevoreeService';
import { Hoverlay } from '../hoverlay';
import { DND_ITEM } from '../../utils/constants';
import { distributeElements } from '../../utils/dagreify';

import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';

import './Diagram.css';

interface DiagramProps {
  kevoreeService?: KevoreeService;
}

@inject('kevoreeService')
@observer
export class Diagram extends React.Component<DiagramProps> {

  private _listener: kevoree.KevoreeModelListener = {
    elementChanged: (event) => {
      // tslint:disable-next-line
      console.log('=== DIAGRAM KEVOREE LISTENER ===');
      // tslint:disable-next-line
      console.log(event);
      // tslint:disable-next-line
      console.log('================================');
      this.props.kevoreeService!.diagram.repaintCanvas();
    }
  };

  onDrop(event: React.DragEvent<HTMLElement>) {
    try {
      const point = this.props.kevoreeService!.diagram.getRelativeMousePoint(event);
      const tdefPath = event.dataTransfer.getData(DND_ITEM);
      this.props.kevoreeService!.createInstance(tdefPath, point);
    } catch (ignore) {/* noop */}
  }

  onActionStarted(action: BaseAction) {
    // tslint:disable-next-line
    console.log('Diagram.onActionStarted', action);
    return true;
  }

  onActionStopped(action: BaseAction) {
    // tslint:disable-next-line
    console.log('Diagram.onActionStopped', action);
    return true;
  }

  autoLayout() {
    const model = this.props.kevoreeService!.diagram.getDiagramModel();
    const serialized = model.serializeDiagram();
    // tslint:disable-next-line
    console.log(serialized);
    const distributedSerializedDiagram = distributeElements(serialized);
    // deserialize the model
    let deSerializedModel = new DiagramModel();
    deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, this.props.kevoreeService!.diagram);
    this.props.kevoreeService!.diagram.setDiagramModel(deSerializedModel);
    this.props.kevoreeService!.diagram.repaintCanvas();
  }

  zoomIn() {
    const model = this.props.kevoreeService!.diagram.getDiagramModel();
    model.setZoomLevel(model.getZoomLevel() + 10);
    this.props.kevoreeService!.diagram.repaintCanvas();
  }

  zoomOut() {
    const model = this.props.kevoreeService!.diagram.getDiagramModel();
    model.setZoomLevel(model.getZoomLevel() - 10);
    this.props.kevoreeService!.diagram.repaintCanvas();
  }

  zoomToFit() {
    this.props.kevoreeService!.diagram.zoomToFit();
  }

  componentDidMount() {
    const kevoreeService = this.props.kevoreeService!;
    kevoreeService.diagram.getDiagramModel().setZoomLevel(150);
    kevoreeService.model.addModelElementListener(this._listener);
  }

  componentWillUnmount() {
    this.props.kevoreeService!.model.removeModelElementListener(this._listener);
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
            diagramEngine={this.props.kevoreeService!.diagram}
            inverseZoom={true}
            allowLooseLinks={false}
            deleteKeys={[46]}
            actionStartedFiring={(action) => this.onActionStarted(action)}
            actionStoppedFiring={(action) => this.onActionStopped(action)}
          />
        </Hoverlay>
      </div>
    );
  }
}
