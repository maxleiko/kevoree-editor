import * as React from 'react';
import * as kevoree from 'kevoree-library';

import { Input } from '../../input';
import { toBoolean } from '../../../utils/kevoree';

import './Param.scss';

export interface ParamProps {
    param: kevoree.Value<kevoree.Dictionary>;
    attr: kevoree.DictionaryAttribute;
}

export class Param extends React.Component<ParamProps> {

    private _listener: kevoree.KevoreeModelListener = {
        elementChanged: () => this.forceUpdate()
    };

    componentDidMount() {
        this.props.param.addModelElementListener(this._listener);
    }

    componentWillUnmount() {
        this.props.param.removeModelElementListener(this._listener);
    }

    renderString(param: kevoree.Value<kevoree.Dictionary>) {
        return <Input value={param.value} onCommit={(v) => param.value = v} />;
    }

    renderBoolean(param: kevoree.Value<kevoree.Dictionary>) {
        return (
            <input
                type="checkbox"
                checked={toBoolean(param.value)}
                onChange={(e) => param.value = e.target.checked + ''}
            />
        );
    }

    renderNumber(param: kevoree.Value<kevoree.Dictionary>) {
        return <Input type="number" value={param.value} onCommit={(v) => param.value = v} />;
    }

    renderValue(param: kevoree.Value<kevoree.Dictionary>, attr: kevoree.DictionaryAttribute) {
        switch (attr.datatype.name$) {
            case 'BOOLEAN':
                return this.renderBoolean(param);

            case 'STRING':
                return this.renderString(param);
            
            case 'FLOAT':
            case 'INT':
            case 'DOUBLE':
            case 'LONG':
            case 'SHORT':
                return this.renderNumber(param);

            default:
                return param.value;
        }
    }

    render() {
        const { param, attr } = this.props;
        return (
            <div className="Param">
                <div className="name">{param.name}:</div>
                <div className="value">{this.renderValue(param, attr)}</div>
            </div>
        );
    }
}