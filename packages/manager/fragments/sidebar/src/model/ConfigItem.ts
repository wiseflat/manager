export class ConfigItem {
  label: string;
  url: string;
  app?: string;
  apiPath?: string;
  subItems?: ConfigItem[];

  constructor({
    label,
    url,
    app,
    apiPath,
    subItems
  }: {
    label: string,
    url: string,
    app?: string,
    apiPath?: string,
    subItems?: ConfigItem[]
  }) {
    this.label = label;
    this.url = url;
    this.app = app;
    this.apiPath = apiPath;
    this.subItems = subItems;
  }
}

export default {
  ConfigItem
}
