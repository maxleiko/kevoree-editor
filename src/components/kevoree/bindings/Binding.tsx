import * as React from 'react';
import * as kevoree from 'kevoree-library';

export interface BindingProps {
    binding: kevoree.Binding;
}

export class Binding extends React.Component<BindingProps> {

    render() {
        const { hub, port } = this.props.binding;
        
        return (
            <div>
                <div>
                    <strong>Chan: </strong>
                    <span>{hub ? hub.path() : 'null'}</span>
                </div>
                <div>
                    <strong>Port: </strong>
                    <span>{port ? port.path() : 'null'}</span>
                </div>
            </div>
        );
    }
}