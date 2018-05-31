import * as React from 'react';
import { Instance } from 'kevoree-ts-model';

import { Collapsible } from '../../collapsible';
import { InstanceHeader, Params, Description } from '..';

import './InstanceDetails.scss';

export interface InstanceDetailsProps {
  instance: Instance;
}

const InstanceDetailsHeader = ({ title }: { title: string }) => (
  <span className="InstanceDetails-group-header">{title}</span>
);

export class InstanceDetails extends React.Component<InstanceDetailsProps> {

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
