import * as React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import './CustomScrollbar.scss';

export class CustomScrollbar extends React.Component<any> {

    constructor(props: any) {
        super(props);
        this.state = { top: 0 };
        this.renderThumb = this.renderThumb.bind(this);
    }

    renderThumb({ style, ...props }: { style: React.CSSProperties, [s: string]: any }) {
        const thumb: React.CSSProperties = {
            backgroundColor: '#454545',
            borderRadius: 3
        };
        return <div className="CustomScrollbar" style={{ ...style, ...thumb }} {...props} />;
    }

    render() {
        return (
            <Scrollbars
                autoHide={true}
                renderThumbVertical={this.renderThumb}
                {...this.props}
            />
        );
    }
}