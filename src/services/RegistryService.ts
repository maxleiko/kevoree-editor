import * as kRegistry from 'kevoree-registry-client';

import { KevoreeService } from './KevoreeService';

export class RegistryService {

  private _kevoreeService: KevoreeService;

  constructor(kevoreeService: KevoreeService) {
    this._kevoreeService = kevoreeService;
  }

  namespace(name: string) {
    return kRegistry.namespace.get(name)
      .then((namespace) => this._kevoreeService.updateNamespaces([namespace]));
  }

  namespaces() {
    return kRegistry.namespace.all()
      .then((namespaces) => this._kevoreeService.updateNamespaces(namespaces));
  }

  tdefs(namespace: string) {
    return kRegistry.tdef.getLatestsByNamespace(namespace)
      .then((tdefs) => this._kevoreeService.updateTypeDefinitions(namespace, tdefs));
  }
}