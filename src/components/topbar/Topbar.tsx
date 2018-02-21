import * as React from 'react';
import { observer, inject } from 'mobx-react';

import { AppStore } from '../../stores/AppStore';

import './Topbar.css';

export interface TopbarProps {
  appStore?: AppStore;
}

@inject('appStore')
@observer
export class Topbar extends React.Component<TopbarProps> {

  render() {
    const appStore = this.props.appStore!;

    return (
      <div className="Topbar navbar navbar-dark bg-dark">
        <div className="form-inline">
          <strong>{appStore.mode === 'model' ? 'Model View' : 'Node view'}</strong>
        </div>
      </div>
    );
  }
}