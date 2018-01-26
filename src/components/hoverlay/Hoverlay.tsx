import * as React from 'react';

import './Hoverlay.css';

interface HoverlayProps {
  overlay: React.ReactElement<{}>;
}
interface HoverlayState {
  hover: boolean;
}

export class Hoverlay extends React.Component<HoverlayProps & React.HTMLAttributes<HTMLDivElement>, HoverlayState> {

  constructor(props: HoverlayProps) {
    super(props);
    this.state = { hover: false };
  }

  render() {
    return (
      <div
        className="Hoverlay"
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <div className={['Hoverlay-overlay', this.state.hover ? 'fade-in' : 'fade-out'].join(' ')}>
          {this.props.overlay}
        </div>
        {this.props.children}
      </div>
    );
  }
}
