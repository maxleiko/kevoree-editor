import * as React from 'react';
import { DiagramEngine, DiagramWidget } from 'storm-react-diagrams';

import { Hoverlay } from '../hoverlay';
import { DiagramOverlay } from './DiagramOverlay';
import { SIDEBAR_ITEM_DT } from '../sidebar/SidebarItem';
import { TypeDefinition } from '../../types/kevoree.d';
import { Kevoree2DiagramFactory } from '../../Kevoree2DiagramFactory';

import './Diagram.css';

interface DiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  engine: DiagramEngine;
}
interface DiagramState {}

export class Diagram extends React.Component<DiagramProps, DiagramState> {

  onDrop(event: React.DragEvent<HTMLDivElement>) {
    const model = this.props.engine.getDiagramModel();
    const tdef: TypeDefinition = JSON.parse(event.dataTransfer.getData(SIDEBAR_ITEM_DT));
    const nodesCount = Object.keys(model.getNodes()).length;
    const node = Kevoree2DiagramFactory.create(tdef, nodesCount);
    const points = this.props.engine.getRelativeMousePoint(event);
    node.x = points.x;
    node.y = points.y;
    model.addNode(node);
    this.props.engine.repaintCanvas();
  }

  componentDidMount() {
    this.props.engine.getDiagramModel().setZoomLevel(150);
  }

  render() {
    return (
      <div
        className="Diagram"
        onDrop={(event) => this.onDrop(event)}
        onDragOver={(event) => event.preventDefault()}
      >
        <Hoverlay overlay={<DiagramOverlay engine={this.props.engine} />}>
          <DiagramWidget
            diagramEngine={this.props.engine}
            inverseZoom={true}
            allowLooseLinks={false}
          />
        </Hoverlay>
      </div>
    );
  }
}
