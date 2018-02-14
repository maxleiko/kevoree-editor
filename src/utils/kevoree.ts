import * as kevoree from 'kevoree-library';
import { KEVOREE_COMP_TYPE, KEVOREE_CHAN_TYPE, KEVOREE_GROUP_TYPE, KEVOREE_NODE_TYPE } from './constants';

export function isComponentType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith(KEVOREE_COMP_TYPE);
}

export function isChannelType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith(KEVOREE_CHAN_TYPE);
}

export function isGroupType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith(KEVOREE_GROUP_TYPE);
}

export function isNodeType(tdef: kevoree.TypeDefinition) {
  return tdef.metaClassName().startsWith(KEVOREE_NODE_TYPE);
}