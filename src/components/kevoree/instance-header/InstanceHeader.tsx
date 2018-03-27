import * as React from 'react';
import * as cx from 'classnames';
import * as kevoree from 'kevoree-library';
import { toast } from 'react-toastify';

import { Editable } from '../../editable';
import { str2rgb } from '../../../utils/colors';
import { isModel } from '../../../utils/kevoree';
import { getType, isNameValid } from '../../../utils/kevoree';

import './InstanceHeader.scss';

export interface InstanceHeaderProps {
    instance: kevoree.Instance | kevoree.Model;
    alpha?: number;
    rgb?: kwe.RGB;
    hoverable?: boolean;
    editable?: boolean;
}

type Props = InstanceHeaderProps & React.HTMLAttributes<HTMLDivElement>;

export class InstanceHeader extends React.Component<Props> {

    // private _listener: kevoree.KevoreeModelListener = {
    //     elementChanged: (event) => this.forceUpdate()
    // };

    // componentDidMount() {
    //     this.props.instance.addModelElementListener(this._listener);
    // }

    // componentWillUnmount() {
    //     this.props.instance.removeModelElementListener(this._listener);
    // }

    renderAsModel(model: kevoree.Model) {
        const { className } = this.props;

        return (
            <div className={cx('InstanceHeader', className)}>
                <span className="name">/</span>
                <span className="type">Model</span>
            </div>
        );
    }

    renderName(instance: kevoree.Instance) {
        const { editable = true } = this.props;

        if (editable) {
            return (
                <Editable
                    className="name"
                    value={instance.name}
                    onCommit={(name) => instance.name = name}
                    validate={(name) => {
                        const valid = isNameValid(instance, name);
                        if (!valid) {
                            toast.warn(<span>Instance name <strong>{name}</strong> must be unique</span>);
                        }
                        return valid;
                    }}
                />
            );
        } else {
            return <span className="name">{instance.name}</span>;
        }
    }

    renderAsInstance(instance: kevoree.Instance) {
        const { rgb, className, alpha = 0.8, hoverable = true, editable = true } = this.props;

        if (instance.typeDefinition) {
            let { r, g, b } = str2rgb(instance.typeDefinition.name);
            if (typeof rgb !== 'undefined') {
                r = rgb!.r;
                g = rgb!.g;
                b = rgb!.b;
            }
            const classNames = cx(
                'InstanceHeader',
                getType(instance.typeDefinition),
                { hoverable, editable },
                className
            );
    
            return (
                <div
                    className={classNames}
                    style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` }}
                >
                    {this.renderName(instance)}
                    <span className="type">
                        {instance.typeDefinition.name}/{instance.typeDefinition.version}
                    </span>
                </div>
            );
        }

        return null;
    }

    render() {
        const { instance } = this.props;

        return isModel(instance)
            ? this.renderAsModel(instance)
            : this.renderAsInstance(instance);
    }
}