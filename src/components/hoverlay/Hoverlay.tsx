import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as cx from 'classnames';

import { KevoreeService } from '../../services';
import { DiagramStore, SelectionPanelStore } from '../../stores';
import { SelectionListener } from '../../listeners';

import './Hoverlay.css';

interface HoverlayProps {
  overlay: React.ReactElement<{}>;
  kevoreeService?: KevoreeService;
  diagramStore?: DiagramStore;
  selectionPanelStore?: SelectionPanelStore;
}
interface HoverlayState {
  hover: boolean;
}

@inject('kevoreeService', 'diagramStore', 'selectionPanelStore')
@observer
export class Hoverlay extends React.Component<HoverlayProps & React.HTMLAttributes<HTMLDivElement>, HoverlayState> {

  private _listener = new SelectionListener(() => this.forceUpdate());

  constructor(props: HoverlayProps) {
    super(props);
    this.state = { hover: false };
  }

  componentDidMount() {
    this.props.kevoreeService!.model.addModelTreeListener(this._listener);
  }

  componentWillUnmount() {
    this.props.kevoreeService!.model.removeModelTreeListener(this._listener);
  }

  render() {
    const isOpen = this.props.kevoreeService!.getSelection(this.props.diagramStore!.path).length > 0;
    const { width } = this.props.selectionPanelStore!;

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
