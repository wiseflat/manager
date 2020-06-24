import * as angular from 'angular';

class Apollo {
    constructor(client, $q) {
        this.client = client;
        this.$q = $q;
    }
    query(options) {
        this.check();
        return this.wrap(this.client.query(options));
    }
    readQuery(options) {
      this.check();
      return this.wrap(this.client.readQuery(options));
    }
    writeQuery(options) {
      this.check();
      return this.wrap(this.client.writeQuery(options));
    }
    readFragment(options) {
      this.check();
      return this.wrap(this.client.readFragment(options));
    }
    writeFragment(options) {
      this.check();
      return this.wrap(this.client.writeFragment(options));
    }
    mutate(options) {
        this.check();
        return this.wrap(this.client.mutate(options));
    }
    resetStore(options) {
      this.check();
      return this.wrap(this.client.resetStore(options));
    }
    clearStore(options) {
      this.check();
      return this.wrap(this.client.clearStore(options));
    }
    reFetchObservableQueries(includeStandby) {
      this.check();
      return this.wrap(this.client.reFetchObservableQueries(includeStandby));
    }
    check() {
        if (!this.client) {
            throw new Error('Client is missing. Use ApolloProvider.defaultClient');
        }
    }
    wrap(promise) {
        return this.$q((resolve, reject) => {
            promise.then(resolve).catch(reject);
        });
    }
}

export default class ApolloProvider {
    constructor() {
        this.$get = ['$q', $q => new Apollo(this.client, $q)];
    }
    defaultClient(client) {
        this.client = client;
    }
}
