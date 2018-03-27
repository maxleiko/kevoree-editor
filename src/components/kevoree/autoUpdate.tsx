import * as React from 'react';
import * as kevoree from 'kevoree-library';

export function autoUpdate<P>(elemInProp: string) {
  return function wrap(Component: React.ComponentClass): React.ComponentClass<P> {
    return class extends React.Component<P> {
      static displayName: string = `${Component.name}-autoUpdate`;
  
      private _listener: kevoree.KevoreeModelListener = {
        elementChanged: () => this.forceUpdate()
      };
  
      componentDidMount() {
        if (this.props[elemInProp]) {
          this.props[elemInProp].addModelElementListener(this._listener);
        }
      }
  
      componentWillUnmount() {
        if (this.props[elemInProp]) {
          this.props[elemInProp].removeModelElementListener(this._listener);
        }
      }
  
      render() {
        return <Component {...this.props} />;
      }
    };
  };
}
