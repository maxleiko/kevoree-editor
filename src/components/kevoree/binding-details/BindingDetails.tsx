import * as React from 'react';
import * as kevoree from 'kevoree-ts-model';
import { action } from 'mobx';

import { Collapsible } from '../../collapsible';

import './BindingDetails.scss';

export interface BindingDetailsProps {
  binding: kevoree.Binding;
}

export class BindingDetails extends React.Component<BindingDetailsProps> {

  @action.bound
  changePort(event: React.ChangeEvent<HTMLSelectElement>) {
    const { port } = this.props.binding;
    const isInput = port!.refInParent === 'inputs';
    const name = event.target.value;
    const newPort = isInput ? port!.parent!.getInput(name) : port!.parent!.getOutput(name);
    if (newPort) {
      this.props.binding.port = newPort;
    }
  }

  renderContent() {
    const { channel, port } = this.props.binding;

    return (
      <div>
        <div>
          <strong>Chan: </strong>
          <span>{channel ? channel.path : 'null'}</span>
        </div>
        <div>
          <strong>Port: </strong>
          <select onChange={this.changePort}>
            {port!.parent!.outputs.map((p) => (
              <option key={p.path} value={p.name!}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  render() {
    const binding = this.props.binding;

    return (
      <Collapsible
        className="BindingDetails"
        header={<div>Binding {binding._key}</div>}
        content={this.renderContent()}
      />
    );
  }
}
