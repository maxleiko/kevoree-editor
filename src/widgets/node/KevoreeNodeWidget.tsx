import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';
import * as cx from 'classnames';

import { KevoreeNodeModel } from './KevoreeNodeModel';
import { KevoreeEngine } from '../../KevoreeEngine';

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

  private elem: HTMLDivElement;

  constructor(props: KevoreeNodeWidgetProps) {
    super(props);
    this.state = { canDrop: false };
  }

  // onDrop(event: React.DragEvent<HTMLDivElement>) {
  //   const tdef: TypeDefinition = JSON.parse(event.dataTransfer.getData(DND_ITEM));
  //   if (tdef.type === 'component') {
  //     const comp = this.props.kevoreeEngine.createInstance(tdef);
  //     if (comp instanceof KevoreeComponentModel) {
  //       this.props.node.addChild(comp);
  //       event.preventDefault();
  //       this.props.diagramEngine.repaintCanvas();
  //     }
  //   }
  // }

  // onDragOver(event: React.DragEvent<HTMLDivElement>) {
  //   this.setState({ canDrop: true });
  //   // tslint:disable-next-line
  //   console.log('onDrag over', JSON.parse(event.dataTransfer.getData(DND_ITEM)));
  // }

  // onDragLeave(event: React.DragEvent<HTMLDivElement>) {
  //   this.setState({ canDrop: false });
  //   // tslint:disable-next-line
  //   console.log('onDrag leave');
  // }

  componentDidMount() {
    this.props.node.setWidth(this.elem.getBoundingClientRect().width);
    this.props.node.setHeight(this.elem.getBoundingClientRect().height);
  }

  render() {
    return (
      <div
        ref={(elem) => this.elem = elem!}
        className={cx('basic-node', 'kevoree-node', { droppable: this.state.canDrop })}
        style={{ background: this.props.node.color }}
      >
        <div className="title">
          <div className="name">{this.props.node.name}: {this.props.node.typeName}</div>
        </div>
        {/* <div className="children">
          {_.map(this.props.node.children, (node) => {
            return React.createElement(
              NodeWidget,
              {
                diagramEngine: this.props.diagramEngine,
                key: node.id,
                node: node
              },
              this.props.diagramEngine.generateWidgetForNode(node)
            );
          })}
        </div> */}
      </div>
    );
  }
}