import * as React from 'react';
import * as kevoree from 'kevoree-library';

import { Param } from './Param';

export interface ParamsProps {
    params: kevoree.Value<kevoree.Dictionary>[];
    attrs: kevoree.DictionaryAttribute[];
}

export class Params extends React.Component<ParamsProps> {

    getAttr(name: string) {
        return this.props.attrs.find((attr) => attr.name === name)!;
    }

    render() {
        const { params } = this.props;

        return (
            <div>
                {params.map((param) => (
                    <Param key={param.name} param={param} attr={this.getAttr(param.name)} />
                ))}
            </div>
        );
    }
}