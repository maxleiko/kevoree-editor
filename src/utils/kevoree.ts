import * as kevoree from 'kevoree-library';
import { KEVOREE_CHANNEL, KEVOREE_COMPONENT, KEVOREE_GROUP, KEVOREE_NODE, KWE_SELECTED } from './constants';
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

export function getType(tdef: kevoree.TypeDefinition) {
  if (isChannelType(tdef)) { return KEVOREE_CHANNEL; }
  if (isComponentType(tdef)) { return KEVOREE_COMPONENT; }
  if (isGroupType(tdef)) { return KEVOREE_GROUP; }
  if (isNodeType(tdef)) { return KEVOREE_NODE; }
  throw new Error(`Unknown Kevoree type "${tdef.metaClassName()}"`);
}

export function inferType(tdef: ITypeDefinition) {
  const model = JSON.parse(tdef.model);
  if (model.class.startsWith('org.kevoree.ChannelType')) { return KEVOREE_CHANNEL; }
  if (model.class.startsWith('org.kevoree.ComponentType')) { return KEVOREE_COMPONENT; }
  if (model.class.startsWith('org.kevoree.GroupType')) { return KEVOREE_GROUP; }
  if (model.class.startsWith('org.kevoree.NodeType')) { return KEVOREE_NODE; }
  throw new Error(`Unknown Kevoree type "${model.class}"`);
}

export function isTruish(val: any): boolean {
  if (typeof val === 'string') {
    return val.toLowerCase() === 'true';
  }

  if (typeof val === 'boolean') {
    return val;
  }

  return false;
}

export function isSelected(instance: kevoree.Instance): boolean {
  const sel = instance.findMetaDataByID(KWE_SELECTED);
  if (sel) {
    return isTruish(sel.value);
  }
  return false;
}