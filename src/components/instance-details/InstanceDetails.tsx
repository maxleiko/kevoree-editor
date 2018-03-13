import * as React from 'react';
import * as kevoree from 'kevoree-library';

import { Collapsible } from '../collapsible';
import { InstanceHeader } from '../kevoree';

import './InstanceDetails.scss';

export interface InstanceDetailsProps {
    instance: kevoree.Instance;
}

export class InstanceDetails extends React.Component<InstanceDetailsProps> {

    renderContent() {
        return (
            <div>TODO</div>
        );
    }

    render() {
        return (
            <Collapsible
                className="InstanceDetails"
                defaultOpen={false}
                header={<InstanceHeader instance={this.props.instance} />}
                content={this.renderContent()}
            />
        );
    }
}