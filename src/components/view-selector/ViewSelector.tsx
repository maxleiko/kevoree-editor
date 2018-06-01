import * as React from 'react';
import { Button } from 'reactstrap';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import { AppStore } from '../../stores';
import { ViewProps } from './View';

import './ViewSelector.scss';

export interface ViewSelectorProps {
  appStore?: AppStore;
  views: string[];
  currentView: number;
  children: React.ReactElement<ViewProps>[];
}

@inject('appStore')
@observer
export class ViewSelector extends React.Component<ViewSelectorProps> {

  @action
  changeView(index: number) {
    this.props.appStore!.currentView = index;
  }

  render() {
    const { views, currentView, children } = this.props;

    return (
      <div className="ViewSelector">
        <div className="ViewSelector-container">{children[currentView]}</div>
        <div className="ViewSelector-selector">
          {views.map((name, index) => (
            <Button key={name} active={currentView === index} onClick={() => this.changeView(index)}>
              {name}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}
