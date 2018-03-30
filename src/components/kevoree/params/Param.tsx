import * as React from 'react';
import * as kevoree from 'kevoree-ts-model';

import { Input } from '../../input';
import { toBoolean } from '../../../utils/kevoree';

import './Param.scss';

export interface ParamProps {
  param: kevoree.Value<kevoree.Instance>;
  type: kevoree.ParamType;
}

export class Param extends React.Component<ParamProps> {

  renderString(param: kevoree.Value<kevoree.Instance>) {
    return <Input value={param.value!} onCommit={(v) => (param.value = v)} />;
  }

  renderBoolean(param: kevoree.Value<kevoree.Instance>) {
    return (
      <input
        type="checkbox"
        checked={toBoolean(param.value)}
        onChange={(e) => (param.value = e.target.checked + '')}
      />
    );
  }

  renderNumber(param: kevoree.Value<kevoree.Instance>) {
    return (
      <Input
        type="number"
        value={param.value!}
        onCommit={(v) => (param.value = v)}
      />
    );
  }

  renderValue(param: kevoree.Value<kevoree.Instance>, attr: kevoree.ParamType) {
    switch (attr.datatype) {
      case 'BOOLEAN':
        return this.renderBoolean(param);

      case 'STRING':
        return this.renderString(param);

      case 'FLOAT':
      case 'INT':
      case 'DOUBLE':
      case 'LONG':
      case 'SHORT':
        return this.renderNumber(param);

      default:
        return param.value;
    }
  }

  render() {
    const { param, type } = this.props;
    return (
      <div className="Param">
        <div className="name">{param.name}:</div>
        <div className="value">{this.renderValue(param, type)}</div>
      </div>
    );
  }
}
