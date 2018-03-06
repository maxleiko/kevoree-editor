import * as React from 'react';
import { DiagramWidget, BaseAction, MoveItemsAction, MoveCanvasAction } from 'storm-react-diagrams';
import { observer, inject } from 'mobx-react';
import * as kevoree from 'kevoree-library';
import { ITypeDefinition } from 'kevoree-registry-client';

import { AbstractModel } from './models/AbstractModel';
import { KevoreeService } from '../../services/KevoreeService';
import { Hoverlay } from '../hoverlay';
import { DND_ITEM, DIAGRAM_DEFAULT_ZOOM } from '../../utils/constants';
import { distributeElements } from '../../utils/dagreify';
import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';
import { SelectionPanel } from '../selection-panel';
import { SelectionPanelStore } from '../../stores/SelectionPanelStore';

import './Diagram.css';

export interface DiagramProps {
  selectionPanelStore?: SelectionPanelStore;
  kevoreeService?: KevoreeService;
}

interface DiagramState {
  smartRouting: boolean; // TODO: move it to AppStore
}

@inject('selectionPanelStore', 'kevoreeService')
@observer
export class Diagram extends React.Component<DiagramProps, DiagramState> {

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

  constructor(props: DiagramProps) {
    super(props);
    this.state = {
      smartRouting: true,
    };
  }

  onDrop(event: React.DragEvent<HTMLElement>) {
    try {
      const point = this.props.kevoreeService!.diagram.getRelativeMousePoint(event);
      const tdef: ITypeDefinition = JSON.parse(event.dataTransfer.getData(DND_ITEM));
      this.props.kevoreeService!.createInstance(tdef, point);
    } catch (ignore) {/* noop */}
  }

  onActionStarted(action: BaseAction) {
    // tslint:disable-next-line
    console.log('Diagram.onActionStarted', action);
    if (action instanceof MoveItemsAction) {
      const selection: AbstractModel<kevoree.Instance>[] = action.selectionModels
        .filter((item) => item.model.hasOwnProperty('instance'))
        .map((selModel) => selModel.model as AbstractModel<kevoree.Instance>);
      this.props.selectionPanelStore!.setSelection(selection);
    } else if (action instanceof MoveCanvasAction) {
      this.props.selectionPanelStore!.clear();
    }
    return true;
  }

  onActionStopped(action: BaseAction) {
    // tslint:disable-next-line
    console.log('Diagram.onActionStopped', action);
    return true;
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

  autoLayout() {
    distributeElements(this.props.kevoreeService!.diagram.getDiagramModel());
    this.props.kevoreeService!.diagram.repaintCanvas();
  }

  smartRoutingToggle() {
    this.setState({ smartRouting: !this.state.smartRouting });
  }

  componentDidMount() {
    const kevoreeService = this.props.kevoreeService!;
    kevoreeService.diagram.getDiagramModel().setZoomLevel(DIAGRAM_DEFAULT_ZOOM);
    kevoreeService.model.addModelElementListener(this._listener);
  }

  componentWillUnmount() {
    this.props.kevoreeService!.model.removeModelElementListener(this._listener);
  }

  generateOverlay() {
    const smartRouting = `Smart routing: ${this.state.smartRouting ? 'on' : 'off'}`;

    return (
      <DiagramOverlay>
        <OverlayIcon name="Zoom in" onClick={() => this.zoomIn()} icon="fa fa-2x fa-search-plus" />
        <OverlayIcon name="Zoom out" onClick={() => this.zoomOut()} icon="fa fa-2x fa-search-minus" />
        <OverlayIcon name="Zoom to fit" onClick={() => this.zoomToFit()} icon="fa fa-2x fa-search" />
        <OverlayIcon name="Auto layout" onClick={() => this.autoLayout()} icon="fa fa-2x fa-th" />
        <OverlayIcon name={smartRouting} onClick={() => this.smartRoutingToggle()} icon="fa fa-2x fa-sitemap" />
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
            smartRouting={this.state.smartRouting}
            actionStartedFiring={(action) => this.onActionStarted(action)}
            actionStoppedFiring={(action) => this.onActionStopped(action)}
          />
        </Hoverlay>
        <SelectionPanel />
      </div>
    );
  }
}
