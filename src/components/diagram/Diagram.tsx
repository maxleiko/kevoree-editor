import * as React from 'react';
import { DiagramWidget, DiagramModel } from '@leiko/react-diagrams';
import { observer, inject } from 'mobx-react';
import { toast } from 'react-toastify';

import { KevoreeStore } from '../../stores';
import { Hoverlay } from '../hoverlay';
import { DND_ITEM } from '../../utils/constants';
import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';
import { SelectionPanel } from '../selection-panel';

import './Diagram.css';
import { action } from 'mobx';

export interface DiagramProps {
  kevoreeStore?: KevoreeStore;
}

const DiagramDetails = observer(({ model }: { model: DiagramModel }) => {
  const { zoom, offsetX, offsetY } = model;
  return (
    <span className="Diagram-details">
      {`(${Math.floor(offsetX)}, ${Math.floor(offsetY)}) x${Math.floor(zoom)}`}
    </span>
  );
});

@inject('kevoreeStore', 'selectionPanelStore')
@observer
export class Diagram extends React.Component<DiagramProps> {

  onDrop(event: React.DragEvent<HTMLDivElement>) {
    try {
      const point = this.props.kevoreeStore!.engine.getRelativeMousePoint(event);
      const tdef = JSON.parse(event.dataTransfer.getData(DND_ITEM));
      this.props.kevoreeStore!.createInstance(tdef, point);
    } catch (err) {
      // tslint:disable-next-line
      console.error(err.stack);
      toast.error(err.message);
    }
  }

  @action.bound
  onDblClick(event: React.MouseEvent<HTMLDivElement>) {
    const { model } = this.props.kevoreeStore!.engine;
    model.zoom = 100;
    model.offsetX = 0;
    model.offsetY = 0;
  }

  generateOverlay() {
    const store = this.props.kevoreeStore!;
    const smartRouting = `Smart routing: ${store.engine.model.smartRouting ? 'on' : 'off'}`;

    return (
      <DiagramOverlay>
        <OverlayIcon name="Zoom in" onClick={store.zoomIn} icon="fa fa-2x fa-search-plus" />
        <OverlayIcon name="Zoom out" onClick={store.zoomOut} icon="fa fa-2x fa-search-minus" />
        <OverlayIcon name="Zoom to fit" onClick={store.fitContent} icon="fa fa-2x fa-search" />
        <OverlayIcon name="Auto layout" onClick={store.autoLayout} icon="fa fa-2x fa-th" />
        <OverlayIcon name={smartRouting} onClick={store.toggleSmartRouting} icon="fa fa-2x fa-sitemap" />
      </DiagramOverlay>
    );
  }

  render() {
    const engine = this.props.kevoreeStore!.engine;

    return (
      <div
        className="Diagram"
        onDoubleClick={this.onDblClick}
        onDrop={(event) => this.onDrop(event)}
        onDragOver={(event) => event.preventDefault()}
      >
        <Hoverlay overlay={this.generateOverlay()}>
          <DiagramWidget engine={engine} />
        </Hoverlay>
        <DiagramDetails model={engine.model} />
        <SelectionPanel />
      </div>
    );
  }
}
