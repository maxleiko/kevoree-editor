import * as React from 'react';
import * as kevoree from 'kevoree-library';
import { inject } from 'mobx-react';

import { KevoreeService, KevoreeServiceListener } from '../../services';

export interface KevoreeUpdateProps {
    kevoreeService?: KevoreeService;
}

export interface KevoreeUpdateAction {
    (event: kevoree.ModelEvent): boolean;
}

type ComponentClass<P> = React.ComponentClass<P>;
type Component<P> = React.ComponentType<P>;

export function kevoreeUpdateListener<P>(doUpdate: KevoreeUpdateAction = () => true) {
    return function wrap(WrappedComponent: Component<P>): ComponentClass<KevoreeUpdateProps & P> {
        return inject('kevoreeService')(
            class extends React.Component<KevoreeUpdateProps & P> {
        
                private _serviceListener: KevoreeServiceListener = {
                    modelChanged: () => {
                        this.props.kevoreeService!.model.addModelTreeListener(this._modelListener);
                        this.forceUpdate();
                    }
                };
    
                private _modelListener: kevoree.KevoreeModelListener = {
                    elementChanged: (event: kevoree.ModelEvent) => {
                        if (doUpdate(event)) {
                            this.forceUpdate();
                        }
                    }
                };

                componentDidMount() {
                    this.props.kevoreeService!.addListener(this._serviceListener);
                    this.props.kevoreeService!.model.addModelTreeListener(this._modelListener);
                }
    
                componentWillUnmount() {
                    this.props.kevoreeService!.removeListener(this._serviceListener);
                    this.props.kevoreeService!.model.removeModelTreeListener(this._modelListener);
                }
    
                render() {
                    return <WrappedComponent {...this.props} />;
                }
            }
        );
    };
}