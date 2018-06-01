import { FileService, RegistryService } from './services';
import { SelectionPanelStore, RegistryStore, KevoreeStore, AppStore } from './stores';

const appStore = new AppStore();
const fileService = new FileService();
const kevoreeStore = new KevoreeStore();
const registryService = new RegistryService();
const registryStore = new RegistryStore(registryService);
const selectionPanelStore = new SelectionPanelStore();

export const services = {
  fileService, registryService
};

export const stores = {
  appStore, selectionPanelStore, registryStore, kevoreeStore,
};