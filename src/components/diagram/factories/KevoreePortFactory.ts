import { DefaultPortFactory } from '@leiko/react-diagrams';
import { KevoreeLinkFactory } from '.';

export class KevoreePortFactory extends DefaultPortFactory {
  getLinkFactory() {
    return new KevoreeLinkFactory();
  }
}
