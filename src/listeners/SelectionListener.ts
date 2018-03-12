import * as kevoree from 'kevoree-library';

import { AbstractModelListener } from './AbstractModelListener';
import { KWE_SELECTED } from '../utils/constants';

export class SelectionListener extends AbstractModelListener {

  constructor(action: (event: kevoree.ModelEvent) => void) {
    super(action);
  }
  
  elementChanged(event: kevoree.ModelEvent) {
    const source: any = event.source;
    if (source && source.name && source.name === KWE_SELECTED) {
      this._action(event);
    }
  }

}