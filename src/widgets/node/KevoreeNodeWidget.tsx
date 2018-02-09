import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import * as cx from 'classnames';

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

  onDragEnter(event: React.DragEvent<HTMLDivElement>) {
    this.setState({ canDrop: true });
    // tslint:disable-next-line
    console.log('onDrag enter');
  }

  onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    this.setState({ canDrop: false });
    // tslint:disable-next-line
    console.log('onDrag false');
  }

  render() {
    return (
      <div
        className="basic-node kevoree-node"
        style={{ background: this.props.node.color }}
        onDrop={(event) => this.onDrop(event)}
        onDragEnter={(event) => this.onDragEnter(event)}
        onDragLeave={(event) => this.onDragLeave(event)}
      >
        <div className="title">
          <div className="name">{this.props.node.name}</div>
        </div>
        <div className={cx('components', { droppable: this.state.canDrop })}>
          {this.props.node.components.map((comp, i) => (
            <KevoreeComponentWidget key={i} node={comp} diagramEngine={this.props.diagramEngine} />
          ))}
        </div>
      </div>
    );
  }
}