import { Instance, Node, Component, Channel, Group } from 'kevoree-ts-model';

export function isNameValid(instance: Instance, name: string): boolean {
  if (instance instanceof Node) {
    return instance.parent!.nodes
      .filter((n) => n.path !== instance.path)
      .find((n) => n.name === name) === undefined;
  } else if (instance instanceof Component) {
    return instance.parent!.components
      .filter((c) => c.path !== instance.path)
      .find((c) => c.name === name) === undefined;
  } else if (instance instanceof Channel) {
    return instance.parent!.channels
      .filter((c) => c.path !== instance.path)
      .find((c) => c.name === name) === undefined;
  } else if (instance instanceof Group) {
    return instance.parent!.groups
      .filter((g) => g.path !== instance.path)
      .find((g) => g.name === name) === undefined;
  }
  return false;
}