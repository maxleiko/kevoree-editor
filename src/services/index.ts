import { KevoreeService } from './KevoreeService';
import { RegistryService } from './RegistryService';

export const kevoreeService = new KevoreeService();
export const registryService = new RegistryService(kevoreeService);