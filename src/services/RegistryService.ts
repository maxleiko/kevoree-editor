import * as kRegistry from 'kevoree-registry-client';
import * as _ from 'lodash';

export class RegistryService {

  /**
   * Returns the Namespace if it exists
   * @param name 
   */
  namespace(name: string) {
    return kRegistry.namespace.get(name);
  }

  /**
   * Returns all the Namespaces
   */
  namespaces() {
    return kRegistry.namespace.all();
  }

  /**
   * Returns the latest TypeDefinitions for the given Namespace
   * @param namespace 
   */
  tdefs(namespace: string) {
    return kRegistry.tdef.getLatestsByNamespace(namespace);
  }

  /**
   * Returns the latest TypeDefinitions for all Namespaces
   */
  latestTdefs() {
    return this.namespaces()
      .then((namespaces) => Promise.all(namespaces.map((ns) => this.tdefs(ns.name))))
      .then((namespacesTdefs) => _.flatten(namespacesTdefs));
  }
}