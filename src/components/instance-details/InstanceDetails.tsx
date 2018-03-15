import * as React from 'react';
import * as kevoree from 'kevoree-library';

import { Collapsible } from '../collapsible';
import { InstanceHeader } from '../kevoree';
import { Params } from './Params';
import * as kUtils from '../../utils/kevoree';

import './InstanceDetails.scss';

export interface InstanceDetailsProps {
    instance: kevoree.Instance;
}

export class InstanceDetails extends React.Component<InstanceDetailsProps> {

    private _listener: kevoree.KevoreeModelListener = {
        elementChanged: () => this.forceUpdate()
    };

    componentDidMount() {
        this.props.instance.addModelElementListener(this._listener);
    }

    componentWillUnmount() {
        this.props.instance.removeModelElementListener(this._listener);
    }

    renderContent() {
        const { instance } = this.props;
        const desc = kUtils.getDescription(instance.typeDefinition!) || '<em>no description</em>';

        return (
            <div className="InstanceDetails-content">
                <Collapsible
                    header={<span style={{ fontWeight: 'bold' }}>Description</span>}
                    content={<div dangerouslySetInnerHTML={{ __html: desc }} />}
                    withIcons={true}
                />
                <Collapsible
                    header={<span style={{ fontWeight: 'bold' }}>Params</span>}
                    content={
                        <Params
                            params={instance.dictionary.values.array}
                            attrs={instance.typeDefinition!.dictionaryType.attributes.array}
                        />
                    }
                    withIcons={true}
                />
            </div>
        );
    }

    render() {
        return (
            <Collapsible
                className="InstanceDetails"
                header={<InstanceHeader instance={this.props.instance} />}
                content={this.renderContent()}
            />
        );
    }
}