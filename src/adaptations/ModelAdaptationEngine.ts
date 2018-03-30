// import * as kevoree from 'kevoree-library';

// import { AbstractAdaptationEngine } from './AbstractAdaptationEngine';
// import { DiagramStore } from '../stores';
// import { isNode } from '../utils/kevoree';

// export class ModelAdaptationEngine extends AbstractAdaptationEngine<kevoree.Model> {

//     constructor(store: DiagramStore) {
//       super(store);
//     }

//     public adapt(event: kevoree.ModelEvent) {
//       // tslint:disable-next-line
//       console.log(event);

//       switch (event.etype.name$) {
//         case 'ADD':
//           if (event.elementAttributeName === 'nodes') {
//             const node = event.value as kevoree.Node;
//             this._store.addNode(node);
//             return true;
//           } else if (event.elementAttributeName === 'groups') {
//             this._store.addGroup(event.value as kevoree.Group);
//             return true;
//           } else if (event.elementAttributeName === 'hubs') {
//             this._store.addChannel(event.value as kevoree.Channel);
//             return true;
//           }
//           // TODO handle other cases
//           break;
  
//         case 'REMOVE':
//           switch (event.elementAttributeName) {
//             case 'nodes':
//             case 'groups':
//             case 'hubs':
//             case 'components':
//               const vm = this._store.model.getNode(event.previous_value);
//               if (vm) {
//                 vm.remove();
//                 return true;
//               }
//               break;
  
//             default:
//               break;
//           }
//           // TODO handle other cases
//           break;

//         case 'RENEW_INDEX':
//           if (event.source) {
//             if (isNode(event.source)) {
//               if (event.source.getRefInParent() === 'nodes') {
//                 const vm = this._store.model.getNode(event.previousPath!);
//                 if (vm) {
//                   vm.id = event.value;
//                   return true;
//                 }
//               }
//             }
//           }
//           break;
  
//         default:
//           break;
//       }

//       return false;
//     }

//     public createInstances(model: kevoree.Model) {
//       model.nodes.array.forEach((node) => this._store.addNode(node));
//       model.groups.array.forEach((group) => this._store.addGroup(group));
//       model.hubs.array.forEach((chan) => this._store.addChannel(chan));
//     }
// }