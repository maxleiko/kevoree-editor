import * as React from 'react';
import * as kevoree from 'kevoree-library';

import { getDescription } from '../../utils/kevoree';

export interface DescriptionProps {
    instance: kevoree.Instance;
}

export const Description = ({ instance }: DescriptionProps) => {
    if (instance.typeDefinition) {
        const desc = getDescription(instance.typeDefinition);

        if (!desc) {
            return <em className="text-muted">no description</em>;
        }

        return (
            <div
                className="text-justify"
                dangerouslySetInnerHTML={{ __html: desc }}
            />
        );
    }
    return null;
};