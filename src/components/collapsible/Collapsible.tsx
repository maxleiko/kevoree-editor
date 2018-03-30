import * as React from 'react';
import * as cx from 'classnames';
import { Collapse } from 'reactstrap';

import './Collapsible.scss';

export interface CollapsibleProps {
  header: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  withIcons?: boolean;
}

interface CollapsibleState {
  isOpen: boolean;
}

export class Collapsible extends React.Component<
  CollapsibleProps & React.HTMLAttributes<HTMLDivElement>,
  CollapsibleState
> {
  constructor(props: CollapsibleProps) {
    super(props);
    this.state = {
      isOpen: typeof this.props.defaultOpen === 'boolean' ? this.props.defaultOpen! : true
    };
  }

  renderIcons() {
    if (typeof this.props.withIcons === 'boolean' && this.props.withIcons) {
      return <span className="Collapsible-header-icons">{this.state.isOpen ? '-' : '+'}</span>;
    }
    return null;
  }

  render() {
    const { isOpen } = this.state;

    return (
      <div className={cx('Collapsible', this.props.className)}>
        <div className="Collapsible-header" onClick={() => this.setState({ isOpen: !isOpen })}>
          {this.renderIcons()}
          {this.props.header}
        </div>
        <Collapse className="Collapsible-content" isOpen={isOpen}>
          {this.props.content}
        </Collapse>
      </div>
    );
  }
}
