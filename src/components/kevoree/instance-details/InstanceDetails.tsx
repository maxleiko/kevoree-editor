import * as React from 'react';
import * as kevoree from 'kevoree-library';

import { Collapsible } from '../../collapsible';
import { InstanceHeader, Params } from '..';
import * as kUtils from '../../../utils/kevoree';

import './InstanceDetails.scss';

export interface InstanceDetailsProps {
    instance: kevoree.Instance;
}

export class InstanceDetails extends React.Component<InstanceDetailsProps> {

    private _listener: kevoree.KevoreeModelListener = {
        elementChanged: (event) => this.forceUpdate()
    };

    componentDidMount() {
        this.props.instance.addModelElementListener(this._listener);
    }

    componentWillUnmount() {
        this.props.instance.removeModelElementListener(this._listener);
    }

    renderContent() {
        const { instance } = this.props;
        if (instance.typeDefinition) {
            const desc = kUtils.getDescription(instance.typeDefinition) || '<em>no description</em>';

            return (
                <div className="InstanceDetails-content">
                    <Collapsible
                        className="InstanceDetails-group"
                        header={<span className="InstanceDetails-group-header">Description</span>}
                        content={<div className="InstanceDetails-desc" dangerouslySetInnerHTML={{ __html: desc }} />}
                        withIcons={true}
                    />
                    <Collapsible
                        className="InstanceDetails-group"
                        header={<span className="InstanceDetails-group-header">Params</span>}
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

        return null;
    }

    render() {
        return (
            <Collapsible
                className="InstanceDetails"
                header={<InstanceHeader className="InstanceDetails-header" instance={this.props.instance} />}
                content={this.renderContent()}
            />
        );
    }
}