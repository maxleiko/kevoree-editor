import { action, observe } from 'mobx';
import { ADiagramModel, DefaultPointModel, DiagramEngine } from '@leiko/react-diagrams';
import { Model, Node, Group, Component, Channel, Binding, Port, Element } from 'kevoree-ts-model';
import { KevoreeChannelModel } from './KevoreeChannelModel';
import { KevoreeComponentModel } from './KevoreeComponentModel';
import { KevoreeGroupModel } from './KevoreeGroupModel';
import { KevoreeNodeModel } from './KevoreeNodeModel';
import { KevoreeChannelPortModel } from './KevoreeChannelPortModel';
import { KevoreePortModel } from './KevoreePortModel';
import { ChildElement } from 'kevoree-ts-model/dist/impl/ChildElement';
import { KevoreeLinkModel } from './KevoreeLinkModel';
import { KWE_BINDING_POINTS } from '../../../utils/constants';

export class KevoreeDiagramModel extends ADiagramModel {

  private _engine: DiagramEngine;

  constructor(elem: Node | Model, engine: DiagramEngine) {
    super();
    this._engine = engine;
    // configs
    this.deleteKeys = [46];

    // initialize model with given Kevoree element
    if (elem instanceof Node) {
      this.initFromNode(elem);
    } else if (elem instanceof Model) {
      this.initFromModel(elem);
    }

    // register listeners for dynamic binding creation
    observe(this.linksMap, (change) => {
      if (change.type === 'add') {
        const link = change.newValue as KevoreeLinkModel;
        const sourcePort = change.newValue.sourcePort as KevoreePortModel | KevoreeChannelPortModel;
        observe(change.newValue, 'targetPort', (c) => {
          const targetPort = c.newValue as KevoreePortModel | KevoreeChannelPortModel;
          if (sourcePort instanceof KevoreeChannelPortModel) {
            if (targetPort instanceof KevoreeChannelPortModel) {
              // TODO channel 2 channel should not work
            } else if (targetPort instanceof KevoreePortModel) {
              // Kevoree compliant binding: sourcePort === channel && targetPort === port
              const chanVM = sourcePort.parent as KevoreeChannelModel;
              const chan = this.asRoot(elem).getByPath(chanVM.instance.path) as Channel | null;
              const port = this.asRoot(elem).getByPath(targetPort.port.path) as Port | null;
              if (chan && port) {
                const binding = new Binding().withChannelAndPort(chan, port);
                link.binding = binding;
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
                link.binding = binding;
                this.asRoot(elem).addBinding(binding);
              }
            } else if (targetPort instanceof KevoreePortModel) {
              // port 2 port: in Kevoree, binding can't be created between ports directly => create a channel
              const linkVM = change.newValue as KevoreeLinkModel;
              linkVM.addLabel('localChan');
              // const source = this.asRoot(elem).getByPath(sourcePort.port.path) as Port | null;
              // const target = this.asRoot(elem).getByPath(targetPort.port.path) as Port | null;
            }
          }
        });
      }
    });
  }

  initFromNode(node: Node) {
    node.components.forEach((comp) => {
      this.addKevoreeComponent(comp);

      comp.inputs.concat(comp.outputs).forEach((port) => {
        port.bindings.forEach((b) => this.addKevoreeBinding(b));
      });
    });
  }

  initFromModel(model: Model) {
    model.nodes.forEach((node) => this.addKevoreeNode(node));
    model.groups.forEach((group) => this.addKevoreeGroup(group));
    model.channels.forEach((chan) => this.addKevoreeChannel(chan));
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
    let vm: KevoreeLinkModel | null = null;
    if (binding.port && binding.channel) {
      let compVM = this.nodesMap.get(binding.port.parent!.path) as KevoreeComponentModel | undefined;
      if (!compVM) {
        compVM = this.addKevoreeComponent(binding.port.parent!);
      }
      const portVM = compVM.portsMap.get(binding.port.path);
      if (portVM) {
        let chanVM = this.nodesMap.get(binding.channel.path) as KevoreeChannelModel | undefined;
        if (!chanVM) {
          chanVM = this.addKevoreeChannel(binding.channel);
        }
        if (chanVM) {
          const chanPortVM = binding.port.refInParent === 'inputs' ? chanVM.output : chanVM.input;
          vm = portVM.link(chanPortVM);
          vm.binding = binding;
          const meta = binding.getMeta(KWE_BINDING_POINTS);
          if (meta) {
            const points = JSON.parse(meta.value!)
              .map((pt: any) => {
                const point = new DefaultPointModel(pt.x, pt.y);
                point.fromJSON(pt, this._engine);
                return point;
            });
            // tslint:disable-next-line
            console.log('loaded points', points);
          }
          // add link to model
          this.addLink(vm);
        }
      }
    }
    return vm;
  }

  asRoot(elem: Element | ChildElement<any>): Model {
    if (elem instanceof ChildElement) {
      let current = elem as ChildElement<any>;
      while (current.parent) {
        if (current.parent instanceof Model) {
          return current.parent;
        }
        current = current.parent;
      }
    }
    return elem as Model;
  }
}
