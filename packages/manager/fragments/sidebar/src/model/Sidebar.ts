import { SidebarElement } from './SidebarElement';

export class Sidebar {
  items: SidebarElement[];

  constructor(items: SidebarElement[]) {
    this.items = items.filter((item: SidebarElement) => item.isStatic() || item.isSubscribedService())
  }
}

export default Sidebar
