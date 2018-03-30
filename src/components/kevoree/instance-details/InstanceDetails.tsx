import * as React from 'react';
import { Instance, Component } from 'kevoree-ts-model';
import * as _ from 'lodash';

import { Collapsible } from '../../collapsible';
import { InstanceHeader, Params, Description } from '..';

import './InstanceDetails.scss';
import { Bindings } from '../bindings';

export interface InstanceDetailsProps {
  instance: Instance;
}

const InstanceDetailsHeader = ({ title }: { title: string }) => (
  <span className="InstanceDetails-group-header">{title}</span>
);

export class InstanceDetails extends React.Component<InstanceDetailsProps> {

  renderBindings() {
    const { instance } = this.props;
    // only render bindings for components
    if (instance instanceof Component) {
      const comp = instance as Component;
      const bindings = _.flatMap(comp.inputs.concat(comp.outputs).map((port) => port.bindings));
      return (
        <Collapsible
          className="InstanceDetails-group"
          header={<InstanceDetailsHeader title="Bindings" />}
          content={<Bindings bindings={bindings} />}
          withIcons={true}
        />
      );
    }
    return null;
  }

  renderContent() {
    const { instance } = this.props;
    if (instance.tdef) {
      return (
        <div className="InstanceDetails-content">
          <Collapsible
            className="InstanceDetails-group"
            header={<InstanceDetailsHeader title="Description" />}
            content={<Description instance={instance} />}
            withIcons={true}
          />
          <Collapsible
            className="InstanceDetails-group"
            header={<InstanceDetailsHeader title="Params" />}
            content={<Params params={instance.params} dictionary={instance.tdef.dictionary} />}
            withIcons={true}
          />
          {this.renderBindings()}
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <Collapsible
        className="InstanceDetails"
        header={<InstanceHeader className="InstanceDetails-header" instance={this.props.instance} />}
        content={this.renderContent()}
      />
    );
  }
}
