import * as React from 'react';
import * as cx from 'classnames';
import * as kevoree from 'kevoree-library';

import { str2rgb } from '../../../utils/colors';
import { getType } from '../../../utils/kevoree';
import { Editable } from '../../editable';

import './InstanceHeader.scss';

export interface InstanceHeaderProps {
    instance: kevoree.Instance;
    alpha?: number;
    rgb?: kwe.RGB;
}

type Props = InstanceHeaderProps & React.HTMLAttributes<HTMLDivElement>;

export const InstanceHeader = ({ instance, alpha = 0.8, rgb, className }: Props) => {
    let { r, g, b } = str2rgb(instance.typeDefinition!.name);
    if (typeof rgb !== 'undefined') {
        r = rgb!.r;
        g = rgb!.g;
        b = rgb!.b;
    }

    return (
        <div
            className={cx('InstanceHeader', getType(instance.typeDefinition!), className)}
            style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` }}
        >
            <Editable
                value={instance.name}
                onCommit={(name) => instance.name = name}
                className="name"
            />
            <span className="type">
                {instance.typeDefinition!.name}/{instance.typeDefinition!.version}
            </span>
        </div>
    );
};