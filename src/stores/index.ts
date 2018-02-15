import { AppStore } from './AppStore';
import { KevoreeStore } from './KevoreeStore';
import { SidebarStore } from './SidebarStore';

const appStore = new AppStore();
const kevoreeStore = new KevoreeStore();
const sidebarStore = new SidebarStore(kevoreeStore);

export default { appStore, kevoreeStore, sidebarStore };