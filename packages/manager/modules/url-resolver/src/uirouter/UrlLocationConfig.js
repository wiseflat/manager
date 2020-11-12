module.exports = class UrlLocationConfig {
  constructor(url, isHtml5Mode = true, hashPrefix = '') {
    this.url = new URL(url);
    this.isHtml5Mode = isHtml5Mode;
    this.hashPrefixValue = hashPrefix;
  }

  port() {
    return this.url.port || 80;
  }

  protocol() {
    return this.url.protocol.replace(/:/g, '');
  }

  host() {
    return this.url.host;
  }

  baseHref() {
    return this.url.pathname;
  }

  html5Mode() {
    return this.isHtml5Mode;
  }

  hashPrefix(hashPrefix) {
    if (hashPrefix !== undefined) {
      this.hashPrefixValue = hashPrefix;
    }
    return this.hashPrefixValue;
  }
};
