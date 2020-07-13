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
  constructor($cacheFactory, $q, $http, OvhApiMe) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
    this.cache = $cacheFactory('AccountMigrationCache');
  }

  getMigrationDates() {
    return this.getPendingMigration().then((migration) =>
      migration ? get(MIGRATION_DATES, migration.from, {}) : null,
    );
  }

  getMigrationDetails(migrationId) {
    return this.$http
      .get(`/me/migration/${migrationId}`, {
        cache: this.cache,
      })
      .then((detail) => new Migration(detail.data));
  }

  getMigrationList() {
    return this.$http
      .get('/me/migration', {
        headers: {
          [X_PAGINATION_MODE]: CACHED_OBJECT_LIST_PAGES,
        },
        cache: this.cache,
      })
      .then((res) => res.data);
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
              {
                cache: this.cache,
              },
            )
            .then(({ data }) => data)
        : null;
    });
  }

  getMigrationContracts() {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(`/me/migration/${migration.id}/contract`, {
              cache: this.cache,
            })
            .then(({ data }) => data)
        : [];
    });
  }

  getContractInfo(contractId) {
    return this.getPendingMigration().then((migration) => {
      return migration
        ? this.$http
            .get(`/me/migration/${migration.id}/contract/${contractId}`, {
              cache: this.cache,
            })
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
        ? this.$http
            .post(`/me/migration/${migration.id}/contract/${contractId}/accept`)
            .then(() => {
              this.cache.removeAll();
            })
        : null;
    });
  }
}
