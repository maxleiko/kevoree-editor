import * as React from 'react';
import * as kevoree from 'kevoree-ts-model';

export interface BindingProps {
  binding: kevoree.Binding;
}

export class Binding extends React.Component<BindingProps> {
  render() {
    const { channel, port } = this.props.binding;

    return (
      <div>
        <div>
          <strong>Chan: </strong>
          <span>{channel ? channel.path : 'null'}</span>
        </div>
        <div>
          <strong>Port: </strong>
          <span>{port ? port.path : 'null'}</span>
        </div>
      </div>
    );
  }
}
