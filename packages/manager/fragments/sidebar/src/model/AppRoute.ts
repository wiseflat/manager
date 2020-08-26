export class AppRoute {
  app: string;
  url: string;
  universe: string;
  apiPath?: string;

  constructor({app, url, universe, apiPath}: {app: string, url: string, universe: string, apiPath?: string}) {
    this.app = app;
    this.url = url;
    this.universe = universe;
    this.apiPath = apiPath;
  }
}

export default {AppRoute}
