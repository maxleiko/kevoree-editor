import { DefaultLinkModel } from 'storm-react-diagrams';
import * as kevoree from 'kevoree-library';
import { KevoreePortModel } from './KevoreePortModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';

export class KevoreeLinkModel extends DefaultLinkModel {

    binding: kevoree.Binding;

    constructor() {
        super('kevoree-link');
        const factory = new kevoree.factory.DefaultKevoreeFactory();
        this.binding = factory.createMBinding();
    }

    getSourcePort(): KevoreePortModel | KevoreeChannelPortModel {
        return super.getSourcePort() as KevoreePortModel | KevoreeChannelPortModel;
    }
}