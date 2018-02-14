import * as React from 'react';
import * as cx from 'classnames';

import './OverlayIcon.css';

export interface OverlayIconProps {
  name: string;
  icon: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface OverlayIconState {
  showTooltip: boolean;
}

export class OverlayIcon extends React.Component<OverlayIconProps, OverlayIconState> {

  constructor(props: OverlayIconProps) {
    super(props);
    this.state = { showTooltip: false };
  }

  render() {
    return (
      <button
        className="OverlayIcon"
        onClick={(event) => this.props.onClick(event)}
        onMouseEnter={() => this.setState({ showTooltip: true })}
        onFocus={() => this.setState({ showTooltip: true })}
        onBlur={() => this.setState({ showTooltip: false })}
        onMouseLeave={() => this.setState({ showTooltip: false })}
      >
        <span className={cx('OverlayIcon-tooltip', { 'hovered': this.state.showTooltip })}>{this.props.name}</span>
        <i className={this.props.icon} />
      </button>
    );
  }
}