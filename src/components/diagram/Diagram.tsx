import * as React from 'react';
import { DiagramWidget, BaseAction, MoveItemsAction } from '@leiko/react-diagrams';
import { observer, inject } from 'mobx-react';
import { toast } from 'react-toastify';

import { AbstractModel } from './models/AbstractModel';
import { KevoreeStore } from '../../stores';
import { Hoverlay } from '../hoverlay';
import * as kUtils from '../../utils/kevoree';
import { DND_ITEM } from '../../utils/constants';
import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';
import { SelectionPanel } from '../selection-panel';

import './Diagram.css';

export interface DiagramProps {
  kevoreeStore?: KevoreeStore;
}

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

  onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.shiftKey) {
      // prevent selection panel's text from being selected when selecting nodes
      document.getSelection().removeAllRanges();
    }
  }

  onActionStarted(action: BaseAction) {
    // // tslint:disable-next-line
    // console.log('Diagram.onActionStarted', action);

    return true;
  }

  onActionStopped(action: BaseAction) {
    // // tslint:disable-next-line
    // console.log('Diagram.onActionStopped', action);
    if (action instanceof MoveItemsAction) {
      action.selectionModels.forEach((selModel) => {
        if (selModel.model instanceof AbstractModel) {
          const model = selModel.model as AbstractModel;
          if (model.x !== selModel.initialX && model.y !== selModel.initialY) {
            kUtils.setPosition(model.instance, { x: model.x, y: model.y });
          }
        }
      });
    }
    return true;
  }

  generateOverlay() {
    const store = this.props.kevoreeStore!;
    const smartRouting = `Smart routing: ${store.engine.model.smartRouting ? 'on' : 'off'}`;

    return (
      <DiagramOverlay>
        <OverlayIcon name="Zoom in" onClick={() => store.zoomIn()} icon="fa fa-2x fa-search-plus" />
        <OverlayIcon name="Zoom out" onClick={() => store.zoomOut()} icon="fa fa-2x fa-search-minus" />
        <OverlayIcon name="Zoom to fit" onClick={() => store.fitContent()} icon="fa fa-2x fa-search" />
        <OverlayIcon name="Auto layout" onClick={() => store.autoLayout()} icon="fa fa-2x fa-th" />
        <OverlayIcon name={smartRouting} onClick={() => store.toggleSmartRouting()} icon="fa fa-2x fa-sitemap" />
      </DiagramOverlay>
    );
  }

  render() {
    const { engine } = this.props.kevoreeStore!;

    return (
      <div
        className="Diagram"
        onMouseDown={(event) => this.onMouseDown(event)}
        onDrop={(event) => this.onDrop(event)}
        onDragOver={(event) => event.preventDefault()}
      >
        <Hoverlay overlay={this.generateOverlay()}>
          <DiagramWidget
            engine={engine}
            actionStartedFiring={(action) => this.onActionStarted(action)}
            actionStoppedFiring={(action) => this.onActionStopped(action)}
          />
        </Hoverlay>
        <SelectionPanel />
      </div>
    );
  }
}
