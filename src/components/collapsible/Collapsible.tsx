import * as React from 'react';
import * as cx from 'classnames';
import { Collapse } from 'reactstrap';

import './Collapsible.scss';

export interface CollapsibleProps {
    header: React.ReactElement<any> | string;
    content: React.ReactElement<any> | string;
    defaultOpen?: boolean;
}

interface CollapsibleState {
    isOpen: boolean;
}

export class Collapsible
    extends React.Component<CollapsibleProps & React.HTMLAttributes<HTMLDivElement>, CollapsibleState> {

    constructor(props: CollapsibleProps) {
        super(props);
        this.state = {
            isOpen: typeof this.props.defaultOpen === 'boolean' ? this.props.defaultOpen! : true
        };
    }

    render() {
        const { isOpen } = this.state;

        return (
            <div className={cx('Collapsible', this.props.className)}>
                <div className="Collapsible-header" onClick={() => this.setState({ isOpen: !isOpen })}>
                    {this.props.header}
                </div>
                <Collapse className="Collapsible-content" isOpen={isOpen}>
                    {this.props.content}
                </Collapse>
            </div>
        );
    }
}