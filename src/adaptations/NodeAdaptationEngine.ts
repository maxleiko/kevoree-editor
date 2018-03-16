import * as kevoree from 'kevoree-library';

import { AbstractAdaptationEngine } from './AbstractAdaptationEngine';
import { DiagramStore } from '../stores';

export class NodeAdaptationEngine extends AbstractAdaptationEngine<kevoree.Node> {

    constructor(store: DiagramStore) {
      super(store);
    }

    public adapt(event: kevoree.ModelEvent) {
      // tslint:disable-next-line
      console.log('NodeAdaptationEngine', event);
      switch (event.etype.name$) {
        case 'ADD':
          if (event.elementAttributeName === 'hubs') {
            this._store.addChannel(event.value as kevoree.Channel);
          } else if (event.elementAttributeName === 'components') {
            this._store.addComponent(event.value as kevoree.Component);
          }
          // TODO handle other cases
          break;

        case 'REMOVE':
          switch (event.elementAttributeName) {
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

    public createInstances(node: kevoree.Node) {
      node.components.array.forEach((comp) => {
        this._store.addComponent(comp);

        comp.provided.array
          .concat(comp.required.array)
          .forEach((port) => {
            port.bindings.array.forEach((binding) => {
              if (binding.hub) {
                const vm = this._store.model.getNode(binding.hub.path());
                if (!vm) {
                  this._store.addChannel(binding.hub);
                }
              }
            });
          });
      });
    }
}