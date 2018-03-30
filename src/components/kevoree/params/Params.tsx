import * as React from 'react';
import * as kevoree from 'kevoree-ts-model';

import { Param } from './Param';

export interface ParamsProps {
  params: kevoree.Value<kevoree.Instance>[];
  dictionary: kevoree.ParamType[];
}

export class Params extends React.Component<ParamsProps> {
  getType(name: string) {
    return this.props.dictionary.find((paramType) => paramType.name === name)!;
  }

  render() {
    const { params } = this.props;

    if (params.length === 0) {
      return <em className="text-muted">no parameters</em>;
    }

    return (
      <div>
        {params.map((param) => (
          <Param
            key={param.name!}
            param={param}
            type={this.getType(param.name!)}
          />
        ))}
      </div>
    );
  }
}
