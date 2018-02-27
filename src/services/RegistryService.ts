import * as kRegistry from 'kevoree-registry-client';

export class RegistryService {

  namespace(name: string) {
    return kRegistry.namespace.get(name);
  }

  namespaces() {
    return kRegistry.namespace.all();
  }

  tdefs(namespace: string) {
    return kRegistry.tdef.getLatestsByNamespace(namespace);
  }
}