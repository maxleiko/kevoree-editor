import * as React from 'react';
import { DiagramEngine } from 'storm-react-diagrams';

import './DiagramOverlay.css';

interface DiagramOverlayProps {
  engine: DiagramEngine;
}

export const DiagramOverlay = ({ engine }: DiagramOverlayProps) => {
  const model = engine.getDiagramModel();

  return (
    (
      <div className="DiagramOverlay">
        <i
          className="fa fa-2x fa-search-plus"
          onClick={() => {
            model.setZoomLevel(model.getZoomLevel() + 10);
            engine.repaintCanvas();
          }}
        />
        <i
          className="fa fa-2x fa-search-minus"
          onClick={() => {
            model.setZoomLevel(model.getZoomLevel() - 10);
            engine.repaintCanvas();
          }}
        />
      </div>
    )
  );
};
