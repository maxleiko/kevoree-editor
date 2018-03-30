import { DefaultLinkModel } from 'storm-react-diagrams';
import { Binding } from 'kevoree-ts-model';
import { KevoreePortModel } from './KevoreePortModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';

export class KevoreeLinkModel extends DefaultLinkModel {

    binding: Binding | null;

    constructor() {
        super('kevoree-link');
    }

    getSourcePort(): KevoreePortModel | KevoreeChannelPortModel {
        return super.getSourcePort() as KevoreePortModel | KevoreeChannelPortModel;
    }

    getTargetPort(): KevoreePortModel | KevoreeChannelPortModel {
        return super.getTargetPort() as KevoreePortModel | KevoreeChannelPortModel;
    }
}