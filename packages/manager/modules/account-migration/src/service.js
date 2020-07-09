import map from 'lodash/map';
import { CACHED_OBJECT_LIST_PAGES, X_PAGINATION_MODE } from './constants';
import Migration from './migration.class';

export default class {
  /* @ngInject */
  constructor($q, $http, OvhApiMe) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
    this.migrations = null;
    this.migrationDetailsList = null;
  }

  getUserAgreements() {
    return this.$http.get('/me/agreements').then(({ data }) => data);
  }

  getMigrationDetails(migrationId) {
    return this.$http.get(`/me/migration/${migrationId}`);
  }

  getDetailedList() {
    return this.getMigrationList().then((list) => {
      this.migrations = list;
      const promises = map(list, ({ id }) => this.getMigrationDetails(id));
      return this.$q.all(promises).then((details) => {
        this.migrationDetailsList = new Migration(
          ...map(details, (detail) => detail.data),
        );
        console.log(this.migrationDetailsList);
        return this.migrationDetailsList;
      });
    });
  }

  getMigrationList() {
    return this.$http
      .get('/me/migration', {
        headers: {
          [X_PAGINATION_MODE]: CACHED_OBJECT_LIST_PAGES,
        },
      })
      .then((res) => res.data);
  }

  getMigrationContracts(migrationId) {
    return this.$http.get(`/me/migration/${migrationId}/contract`).$promise;
  }

  getContractDetails(migrationId, contractId) {
    return this.$http
      .get(`/me/migration/${migrationId}/contract/${contractId}`)
      .then(({ data }) => data);
  }

  acceptAgreement(migrationId, contractId) {
    return this.$http.post(
      `/me/migration/${migrationId}/contract/${contractId}/accept`,
    ).$promise;
  }
}
