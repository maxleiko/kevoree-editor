import * as React from 'react';
import * as kevoree from 'kevoree-library';

import { Binding } from '.';

export interface BindingsProps {
  bindings: kevoree.Binding[];
}

export class Bindings extends React.Component<BindingsProps> {
  render() {
    const { bindings } = this.props;

    if (bindings.length === 0) {
      return <em className="text-muted">no bindings</em>;
    }

    return (
      <div>
        {bindings.map((binding) => (
          <Binding key={binding.path()} binding={binding} />
        ))}
      </div>
    );
  }
}
