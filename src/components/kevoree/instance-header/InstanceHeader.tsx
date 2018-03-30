import * as React from 'react';
import * as cx from 'classnames';
import { Instance, Model, Node, Group, Channel, Component } from 'kevoree-ts-model';
import { toast } from 'react-toastify';

import { Editable } from '../../editable';
import { str2rgb } from '../../../utils/colors';
import { isNameValid } from '../../../utils/validators';

import './InstanceHeader.scss';

export interface InstanceHeaderProps {
  instance: Instance | Model;
  alpha?: number;
  rgb?: kwe.RGB;
  hoverable?: boolean;
  editable?: boolean;
}

type Props = InstanceHeaderProps & React.HTMLAttributes<HTMLDivElement>;

function getType(instance: Instance) {
  if (instance instanceof Node) {
    return 'node';
  } else if (instance instanceof Group) {
    return 'group';
  } else if (instance instanceof Channel) {
    return 'channel';
  } else if (instance instanceof Component) {
    return 'component';
  }
  return;
}

export class InstanceHeader extends React.Component<Props> {
  renderAsModel(model: Model) {
    const { className } = this.props;

    return (
      <div className={cx('InstanceHeader', className)}>
        <span className="name">/</span>
        <span className="type">Model</span>
      </div>
    );
  }

  renderName(instance: Instance) {
    const { editable = true } = this.props;

    if (editable) {
      return (
        <Editable
          className="name"
          value={instance.name!}
          onCommit={(name) => (instance.name = name)}
          validate={(name) => {
            const valid = isNameValid(instance, name);
            if (!valid) {
              toast.warn(
                <span>
                  Instance name <strong>{name}</strong> must be unique
                </span>
              );
            }
            return valid;
          }}
        />
      );
    } else {
      return <span className="name">{instance.name}</span>;
    }
  }

  renderAsInstance(instance: Instance) {
    const { rgb, className, alpha = 0.8, hoverable = true, editable = true } = this.props;

    if (instance.tdef) {
      let { r, g, b } = str2rgb(instance.tdef.name!);
      if (typeof rgb !== 'undefined') {
        r = rgb!.r;
        g = rgb!.g;
        b = rgb!.b;
      }
      const classNames = cx('InstanceHeader', getType(instance), { hoverable, editable }, className);

      return (
        <div className={classNames} style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` }}>
          {this.renderName(instance)}
          <span className="type">
            {instance.tdef!.name}/{instance.tdef!.version}
          </span>
        </div>
      );
    }

    return null;
  }

  render() {
    const { instance } = this.props;

    return instance instanceof Model
      ? this.renderAsModel(instance)
      : this.renderAsInstance(instance);
  }
}
