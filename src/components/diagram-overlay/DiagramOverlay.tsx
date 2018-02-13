import * as React from 'react';

import { OverlayIconProps } from './OverlayIcon';

import './DiagramOverlay.css';

export interface DiagramOverlayProps {
  children: React.ReactElement<OverlayIconProps>[];
}

export class DiagramOverlay extends React.Component<DiagramOverlayProps, {}> {

  render() {
    return (
      <div className="DiagramOverlay">
        {this.props.children}
      </div>
    );
  }
}