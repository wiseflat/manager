export class SidebarElement {
  label: string;
  href: string;
  permanent: boolean = false;
  count: number = 0;
  subItems?: SidebarElement[];


  constructor({
    label,
    href,
    apiPath,
    subItems,
    count,
  }: {
    label: string,
    href: string,
    count: number,
    apiPath?: string,
    subItems?: SidebarElement[];
  }) {
    this.label = label;
    this.href = href;
    this.count = count;
    this.permanent = !apiPath;
    this.subItems = subItems;
  }

  isStatic(): boolean {
    return this.permanent;
  }

  isSubscribedService() : boolean {
    return !this.permanent && this.count > 0;
  }
}

export default SidebarElement;
