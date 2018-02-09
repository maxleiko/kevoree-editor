import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import { KevoreeNodeModel } from './KevoreeNodeModel';
import { KevoreeComponentWidget, KevoreeComponentModel } from '../component';
import { KevoreeEngine } from '../../KevoreeEngine';
import { TypeDefinition } from '../../types/kevoree';
import { DND_ITEM } from '../../utils/constants';

import './KevoreeNodeWidget.css';

export interface KevoreeNodeWidgetProps {
  node: KevoreeNodeModel;
  diagramEngine: DiagramEngine;
  kevoreeEngine: KevoreeEngine;
}

interface KevoreeNodeWidgetState {
  canDrop: boolean;
}

export class KevoreeNodeWidget extends React.Component<KevoreeNodeWidgetProps, KevoreeNodeWidgetState> {

  constructor(props: KevoreeNodeWidgetProps) {
    super(props);
    this.state = { canDrop: false };
  }

  onDrop(event: React.DragEvent<HTMLDivElement>) {
    const tdef: TypeDefinition = JSON.parse(event.dataTransfer.getData(DND_ITEM));
    if (tdef.type === 'component') {
      const comp = this.props.kevoreeEngine.createInstance(tdef);
      if (comp instanceof KevoreeComponentModel) {
        this.props.node.addComponent(comp);
        event.preventDefault();
        this.props.diagramEngine.repaintCanvas();
      }
    }
  }

  onDragOver(event: React.DragEvent<HTMLDivElement>) {
    try {
      const tdef: TypeDefinition = JSON.parse(event.dataTransfer.getData(DND_ITEM));
      // tslint:disable-next-line
      console.log(tdef);
      if (tdef.type === 'component') {
        // TODO: check if component is compatible with node
        this.setState({ canDrop: true });
      } else {
        this.setState({ canDrop: false });
      }
    } catch (ignore) {/* noop */}
    event.preventDefault();
  }

  generateComponent(comp: KevoreeComponentModel) {
    return <KevoreeComponentWidget node={comp} diagramEngine={this.props.diagramEngine} />;
  }

  render() {
    return (
      <div className="basic-node kevoree-node" style={{ background: this.props.node.color }}>
        <div className="title">
          <div className="name">{this.props.node.name}</div>
        </div>
        <div
          className="components"
          style={this.state.canDrop ? { borderColor: 'green' } : { borderColor: 'inherit' }}
          onDrop={(event) => this.onDrop(event)}
          onDragOver={(event) => this.onDragOver(event)}
        >
          {this.props.node.components.map((comp) => this.generateComponent.bind(this))}
        </div>
      </div>
    );
  }
}