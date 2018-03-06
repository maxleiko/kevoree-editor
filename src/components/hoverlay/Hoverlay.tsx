import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as cx from 'classnames';

import { SelectionPanelStore } from '../../stores/SelectionPanelStore';

import './Hoverlay.css';

interface HoverlayProps {
  overlay: React.ReactElement<{}>;
  selectionPanelStore?: SelectionPanelStore;
}
interface HoverlayState {
  hover: boolean;
}

@inject('selectionPanelStore')
@observer
export class Hoverlay extends React.Component<HoverlayProps & React.HTMLAttributes<HTMLDivElement>, HoverlayState> {

  constructor(props: HoverlayProps) {
    super(props);
    this.state = { hover: false };
  }

  render() {
    const { isOpen, width } = this.props.selectionPanelStore!;

    return (
      <div
        className="Hoverlay"
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <div
          className={cx('Hoverlay-overlay', { 'fade-in': this.state.hover }, { 'fade-out': !this.state.hover })}
          style={{ right: isOpen ? width + 10 : 0 }}
        >
          {this.props.overlay}
        </div>
        {this.props.children}
      </div>
    );
  }
}
