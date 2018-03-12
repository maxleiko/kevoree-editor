import * as kevoree from 'kevoree-library';

export abstract class AbstractModelListener implements kevoree.KevoreeModelListener {

  protected constructor(protected _action: (event: kevoree.ModelEvent) => void) {}

  abstract elementChanged(event: kevoree.ModelEvent): void;
}