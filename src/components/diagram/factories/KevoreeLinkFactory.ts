import { DefaultLinkFactory } from '@leiko/react-diagrams';
import { KevoreeLinkModel } from '../models/KevoreeLinkModel';

export class KevoreeLinkFactory extends DefaultLinkFactory {

  getNewInstance() {
    return new KevoreeLinkModel();
  }
  
}
