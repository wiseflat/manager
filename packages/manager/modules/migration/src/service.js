export default class {
  /* @ngInject */
  constructor($q, $http, OvhApiMe) {
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
  }

  getUserAgreements() {
    return this.$http.get('/me/agreements').then(({ data }) => data);
  }

  getAllMigrations(migrationId) {
    return this.$http.get(`/me/migration/${migrationId}`).$promise;
  }

  needMigration() {
    return this.OvhApiMe.v6()
      .get()
      .$promise.then((me) => me.ovhSubsidiary === 'FI');
  }

  getMigrationContracts(migrationId) {
    return this.$http.get(`/me/migration/${migrationId}/contract`).$promise;
  }

  getContractDetails(migrationId, contractId) {
    return this.$http
      .get(`/me/migration/${migrationId}/contract/${contractId}`)
      .then(({ data }) => data);
  }
}
