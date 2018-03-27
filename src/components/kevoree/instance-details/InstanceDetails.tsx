import * as React from 'react';
import * as kevoree from 'kevoree-library';
import * as _ from 'lodash';

import { Collapsible } from '../../collapsible';
import { InstanceHeader, Params, Description } from '..';
import * as kUtils from '../../../utils/kevoree';

import './InstanceDetails.scss';
import { Bindings } from '../bindings';

export interface InstanceDetailsProps {
    instance: kevoree.Instance;
}

const InstanceDetailsHeader = ({ title }: { title: string }) => (
    <span className="InstanceDetails-group-header">{title}</span>
);

export class InstanceDetails extends React.Component<InstanceDetailsProps> {

    // private _listener: kevoree.KevoreeModelListener = {
    //     elementChanged: (event) => this.forceUpdate()
    // };

    // componentDidMount() {
    //     this.props.instance.addModelElementListener(this._listener);
    // }

    // componentWillUnmount() {
    //     this.props.instance.removeModelElementListener(this._listener);
    // }

    renderBindings() {
        const { instance } = this.props;
        // only render bindings for components
        if (kUtils.isComponent(instance)) {
            const comp = instance as kevoree.Component;
            const bindings = _.flatMap(
                comp.provided.array.concat(comp.required.array)
                    .map((port) => port.bindings.array)
            );
            return (
                <Collapsible
                    className="InstanceDetails-group"
                    header={<InstanceDetailsHeader title="Bindings" />}
                    content={<Bindings bindings={bindings} />}
                    withIcons={true}
                />
            );
        }
        return null;
    }

    renderContent() {
        const { instance } = this.props;
        if (instance.typeDefinition) {
            return (
                <div className="InstanceDetails-content">
                    <Collapsible
                        className="InstanceDetails-group"
                        header={<InstanceDetailsHeader title="Description" />}
                        content={<Description instance={instance} />}
                        withIcons={true}
                    />
                    <Collapsible
                        className="InstanceDetails-group"
                        header={<InstanceDetailsHeader title="Params" />}
                        content={
                            <Params
                                params={instance.dictionary.values.array}
                                attrs={instance.typeDefinition!.dictionaryType.attributes.array}
                            />
                        }
                        withIcons={true}
                    />
                    {this.renderBindings()}
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