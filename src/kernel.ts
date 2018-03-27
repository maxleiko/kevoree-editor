import { FileService, RegistryService, KevoreeService } from './services';
import { ModalStore, SelectionPanelStore, RegistryStore, DiagramStore } from './stores';

const fileService = new FileService();
const registryService = new RegistryService();
const registryStore = new RegistryStore(registryService);
const kevoreeService = new KevoreeService(registryStore);
const diagramStore = new DiagramStore(kevoreeService);
const modalStore = new ModalStore();
const selectionPanelStore = new SelectionPanelStore();

export const services = {
  fileService, registryService, kevoreeService
};

export const stores = {
  modalStore, diagramStore, selectionPanelStore, registryStore
};