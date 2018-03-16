import * as kevoree from 'kevoree-library';

import { AbstractAdaptationEngine } from './AbstractAdaptationEngine';
import { DiagramStore } from '../stores';

export class ModelAdaptationEngine extends AbstractAdaptationEngine<kevoree.Model> {

    constructor(store: DiagramStore) {
      super(store);
    }

    public adapt(event: kevoree.ModelEvent) {
      switch (event.etype.name$) {
        case 'ADD':
          if (event.elementAttributeName === 'nodes') {
            const node = event.value as kevoree.Node;
            this._store.addNode(node);
          } else if (event.elementAttributeName === 'groups') {
            this._store.addGroup(event.value as kevoree.Group);
          } else if (event.elementAttributeName === 'hubs') {
            this._store.addChannel(event.value as kevoree.Channel);
          }
          // TODO handle other cases
          break;
  
        case 'REMOVE':
          switch (event.elementAttributeName) {
            case 'nodes':
            case 'groups':
            case 'hubs':
            case 'components':
              const vm = this._store.model.getNode(event.previous_value);
              if (vm) {
                vm.remove();
              }
              break;
  
            default:
              break;
          }
          // TODO handle other cases
          break;
  
        default:
          break;
      }
    }

    public createInstances(model: kevoree.Model) {
      model.nodes.array.forEach((node) => this._store.addNode(node));
      model.groups.array.forEach((group) => this._store.addGroup(group));
      model.hubs.array.forEach((chan) => this._store.addChannel(chan));
    }
}