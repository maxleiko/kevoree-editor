import * as React from 'react';
import * as cx from 'classnames';
import * as kevoree from 'kevoree-library';
import { toast } from 'react-toastify';

import { Editable } from '../../editable';
// import { KevoreeUpdate } from '../../kevoree';
import { str2rgb } from '../../../utils/colors';
import { getType, isNameValid } from '../../../utils/kevoree';

import './InstanceHeader.scss';

export interface InstanceHeaderProps {
    instance: kevoree.Instance;
    alpha?: number;
    rgb?: kwe.RGB;
    hoverable?: boolean;
}

type Props = InstanceHeaderProps & React.HTMLAttributes<HTMLDivElement>;

export const InstanceHeader = ({ instance, alpha = 0.8, rgb, className, hoverable = true }: Props) => {
    if (instance.typeDefinition) {
        let { r, g, b } = str2rgb(instance.typeDefinition!.name);
        if (typeof rgb !== 'undefined') {
            r = rgb!.r;
            g = rgb!.g;
            b = rgb!.b;
        }

        const classNames = cx(
            'InstanceHeader',
            getType(instance.typeDefinition!),
            { hoverable },
            className
        );
    
        return (
            <div
                className={classNames}
                style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` }}
            >
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
                <span className="type">
                    {instance.typeDefinition!.name}/{instance.typeDefinition!.version}
                </span>
            </div>
        );
    }
    return null;
};