import { action, observe } from 'mobx';
import {
  DiagramModel,
  DefaultLinkModel,
  DefaultPointFactory,
} from '@leiko/react-diagrams';
import {
  Model,
  Node,
  Group,
  Component,
  Channel,
  Binding,
  Port
} from 'kevoree-ts-model';
import { KevoreeChannelModel } from './KevoreeChannelModel';
import { KevoreeComponentModel } from './KevoreeComponentModel';
import { KevoreeGroupModel } from './KevoreeGroupModel';
import { KevoreeNodeModel } from './KevoreeNodeModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';
import { KevoreePortModel } from './KevoreePortModel';

export class KevoreeDiagramModel extends DiagramModel {
  constructor(elem: Node | Model) {
    super();
    // configs
    this.deleteKeys = [46];

    // initialize model with given Kevoree element
    if (elem instanceof Node) {
      this.initFromNode(elem);
    } else if (elem instanceof Model) {
      this.initFromModel(elem);
    }

    // register listeners for dynamic binding creation
    observe(this.linksMap, change => {
      // tslint:disable-next-line
      console.log('LINKS>>>', change);
      if (change.type === 'add') {
        const sourcePort = change.newValue.sourcePort as KevoreePortModel | KevoreeChannelPortModel;
        // tslint:disable-next-line
        console.log('  >>> from', sourcePort);
        observe(change.newValue, 'targetPort', c => {
          // tslint:disable-next-line
          console.log('  >>> to', c.newValue);
          const targetPort = c.newValue as KevoreePortModel | KevoreeChannelPortModel;
          if (sourcePort instanceof KevoreeChannelPortModel) {
            if (targetPort instanceof KevoreeChannelPortModel) {
              // TODO
            } else if (targetPort instanceof KevoreePortModel) {
              // Kevoree compliant binding: sourcePort === channel && targetPort === port
              const chanVM = sourcePort.parent as KevoreeChannelModel;
              const chan = this.asRoot(elem).getByPath(chanVM.instance.path) as Channel | null;
              const port = this.asRoot(elem).getByPath(targetPort.port.path) as Port | null;
              if (chan && port) {
                const binding = new Binding().withChannelAndPort(chan, port);
                this.asRoot(elem).addBinding(binding);
              }
            }
          } else if (sourcePort instanceof KevoreePortModel) {
            if (targetPort instanceof KevoreeChannelPortModel) {
              // Kevoree compliant binding: sourcePort === port && targetPort === channel
              const chanVM = targetPort.parent as KevoreeChannelModel;
              const chan = this.asRoot(elem).getByPath(chanVM.instance.path) as Channel | null;
              const port = this.asRoot(elem).getByPath(sourcePort.port.path) as Port | null;
              if (chan && port) {
                const binding = new Binding().withChannelAndPort(chan, port);
                this.asRoot(elem).addBinding(binding);
              }
            } else if (targetPort instanceof KevoreePortModel) {
              // TODO
            }

            // in Kevoree, binding can't be created between ports directly
            // we have to create a channel between the two ports
            // const source = this.asRoot(elem).getByPath(link.sourcePort!.id) as Port | null;
            // const target = this.asRoot(elem).getByPath(targetPort.id) as Port | null;
            // TODO
          }
        });
      }
    });
  }

  initFromNode(node: Node) {
    node.components.forEach(comp => {
      this.addKevoreeComponent(comp);

      comp.inputs.concat(comp.outputs)
        .forEach((port) => {
          port.bindings.forEach((b) => this.addKevoreeBinding(b));
        });
    });
  }

  initFromModel(model: Model) {
    model.nodes.forEach(node => this.addKevoreeNode(node));
    model.groups.forEach(group => this.addKevoreeGroup(group));
    model.channels.forEach(chan => this.addKevoreeChannel(chan));
  }

  @action
  addKevoreeNode(node: Node) {
    const vm = new KevoreeNodeModel(node);
    this.addNode(vm);
    return vm;
  }

  @action
  addKevoreeComponent(comp: Component) {
    const vm = new KevoreeComponentModel(comp);
    this.addNode(vm);
    return vm;
  }

  @action
  addKevoreeChannel(chan: Channel) {
    const vm = new KevoreeChannelModel(chan);
    this.addNode(vm);
    return vm;
  }

  @action
  addKevoreeGroup(group: Group) {
    const vm = new KevoreeGroupModel(group);
    this.addNode(vm);
    return vm;
  }

  @action
  addKevoreeBinding(binding: Binding) {
    const vm = new DefaultLinkModel(new DefaultPointFactory());
    if (binding.port && binding.channel) {
      let compVM = this.getNode(binding.port.parent!.path) as KevoreeComponentModel | undefined;
      if (!compVM) {
        compVM = this.addKevoreeComponent(binding.port.parent!);
      }
      const portVM = compVM.getPort(binding.port.name!);
      if (portVM) {
        vm.sourcePort = portVM;
        let chanVM = this.getNode(binding.channel.path) as KevoreeChannelModel | undefined;
        if (!chanVM) {
          chanVM = this.addKevoreeChannel(binding.channel);
        }
        if (chanVM) {
          const chanPortVM =
            binding.port.refInParent === 'inputs'
              ? chanVM.input
              : chanVM.output;
          vm.targetPort = chanPortVM;
          this.addLink(vm);
        }
      }
    }
    return vm;
  }

  private asRoot(elem: Node | Model): Model {
    return elem instanceof Node ? elem.parent! : elem;
  }
}
