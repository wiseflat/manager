import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import {
  CACHED_OBJECT_LIST_PAGES,
  X_PAGINATION_MODE,
  MIGRATION_DATES,
} from './constants';
import Migration from './migration.class';

export default class {
  /* @ngInject */
  constructor($q, $http, OvhApiMe) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
    this.migrations = null;
    this.migrationDetailsList = null;
    this.cache = {
      migrations: 'MIGRATION_MODULE_MIGRATION_IDS',
    };
  }

  getMigrationDates() {
    return this.getPendingMigration().then((migration) =>
      migration ? get(MIGRATION_DATES, migration.from, {}) : null,
    );
  }

  getMigrationDetails(migrationId) {
    return this.$http.get(`/me/migration/${migrationId}`);
  }

  getDetailedList() {
    return this.getMigrationList().then((list) => {
      const promises = map(list, ({ id }) => this.getMigrationDetails(id));
      return this.$q.all(promises).then((details) => {
        this.migrationDetailsList = new Migration(
          ...map(details, (detail) => detail.data),
        );
        return this.migrationDetailsList;
      });
    });
  }

  getMigrationList() {
    return this.migrations
      ? this.$q.when(this.migrations)
      : this.$http
          .get('/me/migration', {
            headers: {
              [X_PAGINATION_MODE]: CACHED_OBJECT_LIST_PAGES,
            },
            cache: this.cache.migrations,
          })
          .then((res) => {
            this.migrations = res.data;
            return this.migrations;
          });
  }

  getPendingMigration() {
    return this.getMigrationList().then((migrationList) =>
      find(migrationList, { status: 'TODO' }),
    );
  }

  getAgreementDetails(contractId) {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(
              `/me/migration/${migration.id}/contract/${contractId}/agreement`,
            )
            .then(({ data }) => data)
        : null;
    });
  }

  getMigrationContracts() {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(`/me/migration/${migration.id}/contract`)
            .then(({ data }) => data)
        : [];
    });
  }

  getContractInfo(contractId) {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(`/me/migration/${migration.id}/contract/${contractId}`)
            .then(({ data }) => ({
              ...data,
              migrationId: migration.id,
            }))
        : null;
    });
  }

  getContractDetails(contractId) {
    return this.$q
      .all([
        this.getContractInfo(contractId),
        this.getAgreementDetails(contractId),
      ])
      .then(([contract, agreement]) => ({
        ...agreement,
        ...contract,
      }));
  }

  getAllContracts() {
    return this.getMigrationContracts().then((contractIds) =>
      this.$q.all(
        map(contractIds, (contractId) => this.getContractDetails(contractId)),
      ),
    );
  }

  acceptAgreement(contractId) {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http.post(
            `/me/migration/${migration.id}/contract/${contractId}/accept`,
          )
        : null;
    });
  }
}
