import { DefaultLinkFactory } from 'storm-react-diagrams';

import { KevoreeLinkModel } from '../models/KevoreeLinkModel';

export class KevoreeLinkFactory extends DefaultLinkFactory {

  getNewInstance(initConfig?: any) {
    return new KevoreeLinkModel();
  }
}