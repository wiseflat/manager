import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import {
  CACHED_OBJECT_LIST_PAGES,
  MIGRATION_DATES,
  MIGRATION_STATUS,
  X_PAGINATION_MODE,
} from './constants';
import Migration from './migration.class';

export default class {
  /* @ngInject */
  constructor($cacheFactory, $q, $http, OvhApiMe) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
    this.migrationDetails = null;
    this.cache = $cacheFactory('AccountMigrationCache');
  }

  getMigrationDates() {
    return this.getMigrationList().then(([migration]) =>
      migration ? get(MIGRATION_DATES, migration.from, {}) : null,
    );
  }

  refreshMigrationDetails() {
    this.cache.removeAll();
    return this.migrationDetails
      ? this.getMigrationDetails(this.migrationDetails.id, true)
      : this.$q.when(null);
  }

  getMigrationDetails(migrationId, force) {
    return this.migrationDetails && !force
      ? this.$q.when(this.migrationDetails)
      : this.$http
          .get(`/me/migration/${migrationId}`, {
            cache: this.cache,
          })
          .then((detail) => {
            // detail.data.steps.forEach(step => {
            //   step.status = 'OK';
            // });
            // detail.data.status = 'TODO';
            // const contractsStep = find(detail.data.steps, {name: 'CONTRACTS'});
            // contractsStep.status = 'PENDING';
            // const debtStep = find(detail.data.steps, {name: 'DEBT'});
            // debtStep.status = 'PENDING';
            // debtStep.debt = {
            //   ovhAccountAmount: {
            //     text: '9€',
            //     value: 9,
            //   },
            // };
            // const ordersStep = find(detail.data.steps, {name: 'ORDERS'});
            // ordersStep.status = 'PENDING';
            // const nicStep = find(detail.data.steps, {name: 'NIC'});
            // nicStep.status = 'PENDING';
            if (this.migrationDetails) {
              Object.assign(this.migrationDetails, detail.data)
            } else {
              this.migrationDetails = new Migration(detail.data);
            }
            return this.migrationDetails;
          });
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
      find(migrationList, { status: MIGRATION_STATUS.TODO }),
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
