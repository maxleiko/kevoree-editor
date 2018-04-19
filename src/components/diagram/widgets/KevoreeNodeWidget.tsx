import * as React from 'react';
import { DiagramEngine } from '@leiko/react-diagrams';
import * as cx from 'classnames';
import { inject, observer } from 'mobx-react';

import { KevoreeNodeModel } from '../models/KevoreeNodeModel';
import { InstanceHeader } from '../../kevoree';
import { KevoreeStore } from '../../../stores';

import './KevoreeNodeWidget.scss';
// import { KevoreeComponentWidget } from './KevoreeComponentWidget';
// import { KevoreeComponentModel } from '../models/KevoreeComponentModel';

export interface KevoreeNodeWidgetProps {
  node: KevoreeNodeModel;
  engine: DiagramEngine;
  kevoreeStore?: KevoreeStore;
}

interface KevoreeNodeWidgetState {
  canDrop: boolean;
}

// interface ComponentsProps {
//   components: KevoreeComponentModel[];
//   engine: DiagramEngine;
// }

// const Components = observer(({ components, engine }: ComponentsProps) => {
//   return (
//     <>
//       {components.map((comp) => <KevoreeComponentWidget key={comp.id} engine={engine} node={comp} />)}
//     </>
//   );
// });

@inject('kevoreeStore')
@observer
export class KevoreeNodeWidget extends React.Component<KevoreeNodeWidgetProps, KevoreeNodeWidgetState> {

  private _elem: HTMLDivElement | null;

  constructor(props: KevoreeNodeWidgetProps) {
    super(props);
    this.state = { canDrop: false };
  }

  openNodeView() {
    this.props.kevoreeStore!.changePath(this.props.node.instance.path);
  }

  onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.keyCode === 13) {
      this.openNodeView();
    }
  }

  componentDidMount() {
    if (this._elem) {
      this.props.node.width = this._elem.getBoundingClientRect().width;
      this.props.node.height = this._elem.getBoundingClientRect().height;
    }
  }

  render() {
    const instance = this.props.node.instance!;

    return (
      <div
        ref={(elem) => this._elem = elem}
        tabIndex={0}
        className={cx('kevoree-node', { droppable: this.state.canDrop })}
        onDoubleClick={() => this.openNodeView()}
        onKeyDown={(event) => this.onKeyDown(event)}
      >
        <InstanceHeader className="header" instance={instance} hoverable={false} />
        <div className="body">
          <ul className="components">
            {this.props.node.instance!.components.map((comp) => (
              <li key={comp.name!}>{comp.name}: {comp.tdef ? comp.tdef.name : '???'}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}