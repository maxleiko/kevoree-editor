import * as React from 'react';
import { Instance } from 'kevoree-ts-model';

import { getDescription } from '../../utils/kevoree';

export interface DescriptionProps {
  instance: Instance;
}

export const Description = ({ instance }: DescriptionProps) => {
  if (instance.tdef) {
    const desc = getDescription(instance.tdef);

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
