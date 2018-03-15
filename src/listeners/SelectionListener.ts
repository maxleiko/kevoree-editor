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
    } else if (event.elementAttributeName === 'metaData') {
      const value = event.value! as kevoree.Value<kevoree.Instance>;
      if (value.name === KWE_SELECTED && event.etype.name$ === 'REMOVE') {
        this._action(event);
      }
    }
  }

}