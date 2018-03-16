import { DefaultLinkModel, PortModel } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';
import { KevoreePortModel } from './KevoreePortModel';
import { KevoreeChannelModel } from '.';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';

export class KevoreeLinkModel extends DefaultLinkModel {

    binding: kevoree.Binding;

    constructor() {
        super();
        const factory = new kevoree.factory.DefaultKevoreeFactory();
        this.binding = factory.createMBinding();
    }

    setSourcePort(port: PortModel) {
        super.setSourcePort(port);
        // tslint:disable-next-line
        console.log('SET SOURCE PORT', port);
        if (port) {
            if (port instanceof KevoreePortModel) {
                // port from component
                this.binding.port = port.port;
            } else if (port instanceof KevoreeChannelPortModel) {
                // port from channel
                this.binding.hub = (port.parent as KevoreeChannelModel).instance;
            }
        }
    }

    setTargetPort(port: PortModel) {
        super.setTargetPort(port);
        // tslint:disable-next-line
        console.log('SET TARGET PORT', port);
        if (port) {
            if (port instanceof KevoreePortModel) {
                // port from component
                this.binding.port = port.port;
            } else {
                // port from channel
                this.binding.hub = (port.parent as KevoreeChannelModel).instance;
            }
        }
    }
}