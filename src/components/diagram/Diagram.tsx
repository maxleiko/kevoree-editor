import * as React from 'react';
import { action, observable } from 'mobx';
import { DiagramWidget, DiagramModel } from '@leiko/react-diagrams';
import { observer, inject } from 'mobx-react';
import { toast } from 'react-toastify';

import { KevoreeStore } from '../../stores';
import { Hoverlay } from '../hoverlay';
import { DND_ITEM } from '../../utils/constants';
import { DiagramOverlay, OverlayIcon } from '../diagram-overlay';
import { SelectionPanel } from '../selection-panel';
import { ContextMenu, ContextMenuItem } from '../context-menu';
import { KevoreeDiagramModel } from './models';

import './Diagram.css';

export interface DiagramProps {
  kevoreeStore?: KevoreeStore;
  onFileDrop: (file: OnDropData) => void;
}

export interface OnDropData {
  name: string;
  data: string;
  toastId: number;
}

const DiagramDetails = observer(({ model }: { model: DiagramModel }) => {
  const { zoom, offsetX, offsetY } = model;
  return (
    <span className="Diagram-details">{`(${Math.floor(offsetX)}, ${Math.floor(offsetY)}) x${Math.floor(zoom)}`}</span>
  );
});

@inject('kevoreeStore', 'selectionPanelStore')
@observer
export class Diagram extends React.Component<DiagramProps> {
  @observable private _contextMenu: ContextMenuItem[] = [
    {
      icon: 'fa-eye',
      name: 'Show channels',
      action: () => {
        const { engine, currentElem } = this.props.kevoreeStore!;
        const diagramModel = engine.model as KevoreeDiagramModel;
        diagramModel.asRoot(currentElem).channels.forEach((c) => diagramModel.addKevoreeChannel(c));
      }
    },
    {
      icon: 'fa-eye-slash',
      name: 'Hide channels',
      action: () => {
        const { engine, currentElem } = this.props.kevoreeStore!;
        const diagramModel = engine.model as KevoreeDiagramModel;
        diagramModel.asRoot(currentElem).channels.forEach((c) => {
          diagramModel.removeNode(c.path);
        });
      }
    },
    {
      icon: 'fa-trash',
      name: 'Delete selection',
      action: action(() => this.props.kevoreeStore!.selection.forEach((i) => i.delete()))
    }
  ];

  private _dropToast: number = -1;

  @action.bound
  onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // explicitly show this is a copy.

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // user might have dropped a Kevore model to load
      const file = files.item(0);
      if (file) {
        // load file as Kevoree model
        const fr = new FileReader();
        fr.readAsText(file);
        fr.onload = (e) => {
          this.props.onFileDrop({ name: file.name, data: (e.target as any).result, toastId: this._dropToast });
          this._dropToast = -1;
        };
        fr.onerror = (err) => {
          // tslint:disable-next-line
          console.error(err);
          toast.error(err);
          this._dropToast = -1;
        };
      }
    } else {
      // user might have dropped a typeDef
      try {
        const point = this.props.kevoreeStore!.engine.getRelativeMousePoint(event);
        const tdefData = event.dataTransfer.getData(DND_ITEM);
        if (tdefData) {
          this.props.kevoreeStore!.createInstance(JSON.parse(tdefData), point, event as any);
        } else {
          toast.warn('You can only drop TypeDefinition or Kevoree model');
        }
      } catch (err) {
        // tslint:disable-next-line
        console.error(err.stack);
        toast.error(err.message);
      }
    }
  }

  @action.bound
  onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer.types.find((t) => t.indexOf('Files') !== -1)) {
      if (this._dropToast === -1) {
        this._dropToast = toast.info('Drop to load as Kevoree model', { autoClose: false, closeOnClick: false });
      }
    }
  }

  @action.bound
  onDragLeave() {
    toast.dismiss(this._dropToast);
    this._dropToast = -1;
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
    // const smartRouting = `Smart routing: ${store.engine.model.smartRouting ? 'on' : 'off'}`;

    return (
      <DiagramOverlay>
        <OverlayIcon name="Zoom in" onClick={store.zoomIn} icon="fa fa-2x fa-search-plus" />
        <OverlayIcon name="Zoom out" onClick={store.zoomOut} icon="fa fa-2x fa-search-minus" />
        <OverlayIcon name="Zoom to fit" onClick={store.fitContent} icon="fa fa-2x fa-search" />
        <OverlayIcon name="Auto layout" onClick={store.autoLayout} icon="fa fa-2x fa-th" />
        {/* <OverlayIcon name={smartRouting} onClick={store.toggleSmartRouting} icon="fa fa-2x fa-sitemap" /> */}
      </DiagramOverlay>
    );
  }

  render() {
    const engine = this.props.kevoreeStore!.engine;

    return (
      <div
        className="Diagram"
        onDoubleClick={this.onDblClick}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <Hoverlay overlay={this.generateOverlay()}>
          <DiagramWidget engine={engine} />
        </Hoverlay>
        <DiagramDetails model={engine.model} />
        <SelectionPanel />
        <ContextMenu contextClass="Diagram" items={this._contextMenu} />
      </div>
    );
  }
}
