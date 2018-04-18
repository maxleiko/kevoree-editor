import { FileService, RegistryService } from './services';
import { ModalStore, SelectionPanelStore, RegistryStore, KevoreeStore } from './stores';

const fileService = new FileService();
const kevoreeStore = new KevoreeStore();
const registryService = new RegistryService();
const registryStore = new RegistryStore(registryService);
const modalStore = new ModalStore();
const selectionPanelStore = new SelectionPanelStore();

export const services = {
  fileService, registryService
};

export const stores = {
  modalStore, selectionPanelStore, registryStore, kevoreeStore,
};