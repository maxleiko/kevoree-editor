import * as kevoree from 'kevoree-library';
import { KEVOREE_CHANNEL, KEVOREE_COMPONENT, KEVOREE_GROUP, KEVOREE_NODE } from './constants';

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

export function getType(tdef: kevoree.TypeDefinition) {
  if (isChannelType(tdef)) { return KEVOREE_CHANNEL; }
  if (isComponentType(tdef)) { return KEVOREE_COMPONENT; }
  if (isGroupType(tdef)) { return KEVOREE_GROUP; }
  if (isNodeType(tdef)) { return KEVOREE_NODE; }
  throw new Error(`Unknown Kevoree type "${tdef.metaClassName()}"`);
}