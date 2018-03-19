import * as React from 'react';
import { DiagramWidget, BaseAction, MoveItemsAction } from 'storm-react-diagrams';
import { observer, inject } from 'mobx-react';
import { ITypeDefinition } from 'kevoree-registry-client';
import { toast } from 'react-toastify';

import { AbstractModel } from './models/AbstractModel';
import { KevoreeService } from '../../services/KevoreeService';
import { DiagramStore } from '../../stores/DiagramStore';
import { Hoverlay } from '../hoverlay';
import * as kUtils from '../../utils/kevoree';
import { DND_ITEM } from '../../utils/constants';
import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';
import { SelectionPanel } from '../selection-panel';

import './Diagram.css';

export interface DiagramProps {
  diagramStore?: DiagramStore;
  kevoreeService?: KevoreeService;
}

@inject('diagramStore', 'selectionPanelStore', 'kevoreeService')
@observer
export class Diagram extends React.Component<DiagramProps> {

  onDrop(event: React.DragEvent<HTMLElement>) {
    try {
      const point = this.props.diagramStore!.engine.getRelativeMousePoint(event);
      const tdef: ITypeDefinition = JSON.parse(event.dataTransfer.getData(DND_ITEM));
      this.props.kevoreeService!.createInstance(tdef, this.props.diagramStore!.path, point);
    } catch (err) {
      toast.error(err.message);
    }
  }

  onActionStarted(action: BaseAction) {
    // tslint:disable-next-line
    console.log('Diagram.onActionStarted', action);
    return true;
  }

  onActionStopped(action: BaseAction) {
    // tslint:disable-next-line
    console.log('Diagram.onActionStopped', action);
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
    const store = this.props.diagramStore!;
    const smartRouting = `Smart routing: ${store.smartRouting ? 'on' : 'off'}`;

    return (
      <DiagramOverlay>
        <OverlayIcon name="Zoom in" onClick={() => store.zoomIn()} icon="fa fa-2x fa-search-plus" />
        <OverlayIcon name="Zoom out" onClick={() => store.zoomOut()} icon="fa fa-2x fa-search-minus" />
        <OverlayIcon name="Zoom to fit" onClick={() => store.zoomToFit()} icon="fa fa-2x fa-search" />
        <OverlayIcon name="Auto layout" onClick={() => store.autoLayout()} icon="fa fa-2x fa-th" />
        <OverlayIcon name={smartRouting} onClick={() => store.toggleSmartRouting()} icon="fa fa-2x fa-sitemap" />
      </DiagramOverlay>
    );
  }

  render() {
    const { engine, smartRouting } = this.props.diagramStore!;

    return (
      <div
        className="Diagram"
        onDrop={(event) => this.onDrop(event)}
        onDragOver={(event) => event.preventDefault()}
      >
        <Hoverlay overlay={this.generateOverlay()}>
          <DiagramWidget
            diagramEngine={engine}
            inverseZoom={true}
            allowLooseLinks={false}
            deleteKeys={[46]}
            smartRouting={smartRouting}
            actionStartedFiring={(action) => this.onActionStarted(action)}
            actionStoppedFiring={(action) => this.onActionStopped(action)}
          />
        </Hoverlay>
        <SelectionPanel />
      </div>
    );
  }
}
