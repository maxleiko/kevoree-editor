import { AppStore } from './AppStore';
import { SidebarStore } from './SidebarStore';

export default (services: any) => ({
  appStore: new AppStore(),
  sidebarStore: new SidebarStore(services.registryService),
});