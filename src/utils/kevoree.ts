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
import { Value, TypeDefinition, Element } from 'kevoree-ts-model';

export function isComponentType(tdef: kevoree.TypeDefinition): tdef is kevoree.ComponentType {
  return tdef.metaClassName().startsWith('org.kevoree.ComponentType');
}

export function isChannelType(tdef: kevoree.TypeDefinition): tdef is kevoree.ChannelType {
  return tdef.metaClassName().startsWith('org.kevoree.ChannelType');
}

export function isGroupType(tdef: kevoree.TypeDefinition): tdef is kevoree.GroupType {
  return tdef.metaClassName().startsWith('org.kevoree.GroupType');
}

export function isNodeType(tdef: kevoree.TypeDefinition): tdef is kevoree.NodeType {
  return tdef.metaClassName().startsWith('org.kevoree.NodeType');
}

export function isNode(e: kevoree.Klass<any>): e is kevoree.Node {
  return e.metaClassName().startsWith('org.kevoree.ContainerNode');
}

export function isModel(e: kevoree.Klass<any>): e is kevoree.Model {
  return e.metaClassName().startsWith('org.kevoree.ContainerRoot');
}

export function isComponent(e: kevoree.Klass<any>): e is kevoree.Component {
  return e.metaClassName().startsWith('org.kevoree.ComponentInstance');
}

export function isChannel(e: kevoree.Klass<any>): e is kevoree.Channel {
  return e.metaClassName().startsWith('org.kevoree.Channel');
}

export function isGroup(e: kevoree.Klass<any>): e is kevoree.Group {
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
  throw new Error(`Unknown Kevoree type "${tdef!.metaClassName()}"`);
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

export function isSelected(elem: Element): boolean {
  const sel = elem.getMeta(KWE_SELECTED);
  if (sel) {
    return toBoolean(sel.value);
  }
  return false;
}

export function getPosition(elem: Element) {
  let position = elem.getMeta(KWE_POSITION);
  if (!position) {
    // if instance has no position yet, then create default to [100,100]
    position = setPosition(elem, { x: 100, y: 100 });
  }
  return JSON.parse(position.value!);
}

export function getDescription(tdef: TypeDefinition) {
  const desc = tdef.getMeta(KEV_DESCRIPTION);
  if (desc) {
    return desc.value;
  }
  return null;
}

export function setPosition(elem: Element, point: kwe.Point): Value<Element> {
  let position = elem.getMeta(KWE_POSITION);
  if (!position) {
    position = new Value<Element>().withName(KWE_POSITION);
    elem.addMeta(position);
  }
  position.value = JSON.stringify(point);
  return position;
}

export function setSelected(elem: Element, value: boolean): void {
  let selected = elem.getMeta(KWE_SELECTED);
  if (!selected) {
    selected = new Value<Element>().withName(KWE_SELECTED);
    elem.addMeta(selected);
  }
  selected.value = value + '';
}