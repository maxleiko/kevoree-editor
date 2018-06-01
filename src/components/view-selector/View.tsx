import * as React from 'react';

export interface ViewProps {
  name: string;
}

export class View extends React.Component<ViewProps> {

  render() {
    return this.props.children;
  }
}