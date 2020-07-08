export default class {
  /* @ngInject */
  constructor($q, $http, OvhApiMe) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
    this.migrationList = null;
  }

  getUserAgreements() {
    return this.$http.get('/me/agreements').then(({ data }) => data);
  }

  getMigrationDetails(migrationId) {
    return this.$http.get(`/me/migration/${migrationId}`).$promise;
  }

  needMigration() {
    return this.$q
      .all([this.OvhApiMe.v6().get(), this.getMigrationList()])
      .then(([me, migrations]) => {
        this.migrationList = migrations;
        return me.ovhSubsidiary === 'FI' && migrations.length > 0;
      });
  }

  getMigrationList() {
    return this.$http.get('/me/migration').then((res) => res.data);
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
