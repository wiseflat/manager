import { buildUrl } from './uirouter';

class UrlResolver {
  constructor() {
    this.MANIFESTS = {};
    this.baseUrls = {};
  }

  setBaseUrls(baseUrls) {
    this.baseUrls = baseUrls;
  }

  getBaseUrls() {
    return this.baseUrls;
  }

  getManifest(manifestBaseUrl) {
    if (this.MANIFESTS[manifestBaseUrl]) {
      return Promise.resolve(this.MANIFESTS[manifestBaseUrl]);
    }

    return fetch(`${manifestBaseUrl}manifest.json`).then((response) => {
      this.MANIFESTS[manifestBaseUrl] = response.json();
      return this.MANIFESTS[manifestBaseUrl];
    });
  }

  resolve(application, route, routeParams = {}, baseUrls = {}) {
    const useBaseUrls = {
      ...this.baseUrls,
      ...baseUrls,
    };

    const applicationBaseUrl = useBaseUrls[application];

    return this.getManifest(applicationBaseUrl).then((manifest) => {
      return buildUrl(manifest.routes[route], routeParams, {
        baseUrl: applicationBaseUrl,
        isHtml5Mode: false,
        hashPrefix: '',
      });
    });
  }

  resolveAll(routes, baseUrls = {}) {
    if (Array.isArray(routes)) {
      return Promise.all(
        routes.map(({ application, route, routeParams }) =>
          this.resolveUrl(application, route, routeParams, baseUrls),
        ),
      );
    }

    return Promise.all(
      Object.keys(routes).reduce((list, routeKey) => {
        const { application, route, routeParams } = routes[routeKey];
        return [
          ...list,
          this.resolveUrl(
            application,
            route,
            routeParams,
            baseUrls,
          ).then((url) => ({ key: routeKey, url })),
        ];
      }, []),
    ).then((urls) =>
      urls.reduce(
        (list, { key, url }) => ({
          ...list,
          [key]: url,
        }),
        {},
      ),
    );
  }
}

export default new UrlResolver();
