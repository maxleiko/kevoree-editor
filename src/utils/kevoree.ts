import * as kevoree from 'kevoree-library';
import {
  KEVOREE_CHANNEL,
  KEVOREE_COMPONENT,
  KEVOREE_GROUP,
  KEVOREE_NODE,
  KWE_SELECTED,
  KWE_POSITION,
  KEV_DESCRIPTION,
} from './constants';
import { ITypeDefinition } from 'kevoree-registry-client';

export function isComponentType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith('org.kevoree.ComponentType');
}

export function isChannelType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith('org.kevoree.ChannelType');
}

export function isGroupType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith('org.kevoree.GroupType');
}

export function isNodeType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith('org.kevoree.NodeType');
}

export function isNode(e: kevoree.Klass<any>) {
  return e.metaClassName().startsWith('org.kevoree.ContainerNode');
}

export function isModel(e: kevoree.Klass<any>) {
  return e.metaClassName().startsWith('org.kevoree.ContainerRoot');
}

export function isComponent(e: kevoree.Klass<any>) {
  return e.metaClassName().startsWith('org.kevoree.ComponentInstance');
}

export function isChannel(e: kevoree.Klass<any>) {
  return e.metaClassName().startsWith('org.kevoree.Channel');
}

export function isGroup(e: kevoree.Klass<any>) {
  return e.metaClassName().startsWith('org.kevoree.Group');
}

export function getType(tdef: kevoree.TypeDefinition) {
  if (isChannelType(tdef)) {
    return KEVOREE_CHANNEL;
  }
  if (isComponentType(tdef)) {
    return KEVOREE_COMPONENT;
  }
  if (isGroupType(tdef)) {
    return KEVOREE_GROUP;
  }
  if (isNodeType(tdef)) {
    return KEVOREE_NODE;
  }
  throw new Error(`Unknown Kevoree type "${tdef.metaClassName()}"`);
}

export function inferType(tdef: ITypeDefinition) {
  const model = JSON.parse(tdef.model);
  if (model.class.startsWith('org.kevoree.ChannelType')) {
    return KEVOREE_CHANNEL;
  }
  if (model.class.startsWith('org.kevoree.ComponentType')) {
    return KEVOREE_COMPONENT;
  }
  if (model.class.startsWith('org.kevoree.GroupType')) {
    return KEVOREE_GROUP;
  }
  if (model.class.startsWith('org.kevoree.NodeType')) {
    return KEVOREE_NODE;
  }
  throw new Error(`Unknown Kevoree type "${model.class}"`);
}

export function toBoolean(val: any): boolean {
  return val === 'true';
}

export function isSelected(instance: kevoree.Instance): boolean {
  const sel = instance.findMetaDataByID(KWE_SELECTED);
  if (sel) {
    return toBoolean(sel.value);
  }
  return false;
}

export function getPosition(instance: kevoree.Instance) {
  let position = instance.findMetaDataByID(KWE_POSITION);
  if (!position) {
    // if instance has no position yet, then create default to [100,100]
    position = setPosition(instance, { x: 100, y: 100 });
  }
  return JSON.parse(position.value);
}

export function getDescription(tdef: kevoree.TypeDefinition) {
  const desc = tdef.findMetaDataByID(KEV_DESCRIPTION);
  if (desc) {
    return desc.value;
  }
  return null;
}

export function setPosition(instance: kevoree.Instance, point: kwe.Point): kevoree.Value<kevoree.Instance> {
  let position = instance.findMetaDataByID(KWE_POSITION);
  if (!position) {
    const factory = new kevoree.factory.DefaultKevoreeFactory();
    position = factory.createValue<kevoree.Instance>().withName(KWE_POSITION);
    instance.addMetaData(position);
  }
  position.value = JSON.stringify(point);
  return position;
}

export function setSelected(instance: kevoree.Instance, value: boolean): void {
  let selected = instance.findMetaDataByID(KWE_SELECTED);
  if (!selected) {
    const factory = new kevoree.factory.DefaultKevoreeFactory();
    selected = factory.createValue<kevoree.Instance>().withName(KWE_SELECTED);
    instance.addMetaData(selected);
  }
  selected.value = value + '';
}

export function isNameValid(instance: kevoree.Instance, name: string): boolean {
  if (isNode(instance)) {
    const node = instance as kevoree.Node;
    const model = node.eContainer() as kevoree.Model;
    return model.nodes.array
      .filter((n) => n.path() !== instance.path())
      .find((n) => n.name === name) === undefined;
  } else if (isComponent(instance)) {
    const comp = instance as kevoree.Component;
    return comp.eContainer().components.array
      .filter((c) => c.path() !== instance.path())
      .find((c) => c.name === name) === undefined;
  } else if (isChannel(instance)) {
    const chan = instance as kevoree.Channel;
    return chan.eContainer().hubs.array
      .filter((c) => c.path() !== instance.path())
      .find((c) => c.name === name) === undefined;
  } else if (isGroup(instance)) {
    const group = instance as kevoree.Channel;
    return group.eContainer().groups.array
      .filter((g) => g.path() !== instance.path())
      .find((g) => g.name === name) === undefined;
  }
  return false;
}