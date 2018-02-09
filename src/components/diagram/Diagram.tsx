import * as React from 'react';
import {
  DiagramEngine, DiagramWidget, BaseAction, MoveItemsAction
} from 'storm-react-diagrams';

import { KevoreeEngine } from '../../KevoreeEngine';
import { Hoverlay } from '../hoverlay';
import { DiagramOverlay } from './DiagramOverlay';
import { DND_ITEM } from '../../utils/constants';
import { TypeDefinition } from '../../types/kevoree.d';

import './Diagram.css';

interface DiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  diagramEngine: DiagramEngine;
  kevoreeEngine: KevoreeEngine;
}
interface DiagramState {}

export class Diagram extends React.Component<DiagramProps, DiagramState> {

  onDrop(event: React.DragEvent<HTMLDivElement>) {
    const model = this.props.diagramEngine.getDiagramModel();
    const tdef: TypeDefinition = JSON.parse(event.dataTransfer.getData(DND_ITEM));

    if (tdef.type !== 'component') {
      const node = this.props.kevoreeEngine.createInstance(tdef);
      const point = this.props.diagramEngine.getRelativeMousePoint(event);
  
      node.x = point.x;
      node.y = point.y;
      model.addNode(node);
      this.props.diagramEngine.repaintCanvas();
    } else {
      // TODO: create an error notification because component cannot be put at model root
    }
  }

  onActionStarted(action: BaseAction) {
    if (action instanceof MoveItemsAction) {
      // move instance action started
      action.selectionModels.forEach((model) => {
        // tslint:disable-next-line
        console.log(model);
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

  componentDidMount() {
    this.props.diagramEngine.getDiagramModel().setZoomLevel(150);
  }

  render() {
    return (
      <div
        className="Diagram"
        onDrop={(event) => this.onDrop(event)}
        onDragOver={(event) => event.preventDefault()}
      >
        <Hoverlay overlay={<DiagramOverlay engine={this.props.diagramEngine} />}>
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
