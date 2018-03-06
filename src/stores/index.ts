import { SidebarStore } from './SidebarStore';
import { SelectionPanelStore } from './SelectionPanelStore';

export default (services: any) => ({
  sidebarStore: new SidebarStore(services.registryService),
  selectionPanelStore: new SelectionPanelStore(),
});