import get from 'lodash/get';
import remove from 'lodash/remove';
import orderBy from 'lodash/orderBy';

angular.module('App').controller(
  'PrivateDatabaseChangeVersionCtrl',
  class PrivateDatabaseChangeVersionCtrl {
    constructor($scope, $stateParams, $translate, Alerter, PrivateDatabase) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.privateDatabaseService = PrivateDatabase;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;

      this.privateDBToUpdate = this.$scope.currentActionData;

      this.loading = {
        init: true,
      };
      this.model = {
        versions: [],
        dbList: [],
        choice: null,
      };

      this.$scope.updateVersion = () => this.updateVersion();

      this.getAvailableVersions();
    }

    getAvailableVersions() {
      this.loading.init = true;

      this.privateDatabaseService
        .getAvailableVersions(this.productId)
        .then((versions) => {
          this.model.versions = versions;

          remove(
            this.model.versions,
            (version) =>
              version.replace(/\./g, '') ===
              this.$scope.currentActionData.version,
          );

          return versions;
        })
        .then(() => {
          this.model.dbList = orderBy(
            this.model.versions.map((db) => {
              const [dbType, dbVersion] = db.split('_');

              return {
                dbType,
                dbVersion: parseFloat(dbVersion),
                label: this.$translate.instant(
                  `privateDatabase_dashboard_version_${dbType}`,
                  {
                    version: dbVersion,
                  },
                ),
                value: db,
              };
            }),
            ['dbType', 'dbVersion'],
            ['asc', 'desc'],
          );
          this.model.dbList.unshift({
            label: this.$translate.instant(
              'privateDatabase_change_version_available_select',
            ),
          });
          this.loading.init = false;
        })
        .catch((err) => {
          this.$scope.resetAction();
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'privateDatabase_change_version_step1_fail',
              {
                t0: this.$scope.entryToDelete,
              },
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }

    updateVersion() {
      this.$scope.resetAction();

      this.privateDatabaseService
        .changeVersion(this.productId, this.model.choice)
        .then((task) => {
          this.$scope.pollAction(task);
          this.alerter.success(
            this.$translate.instant('privateDatabase_change_version_success'),
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant('privateDatabase_change_version_fail'),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }

    getDBType({ type, versionNumber }) {
      const translateKey = `privateDatabase_dashboard_version_${type}`;
      return this.$translate.instant(translateKey, {
        version: versionNumber,
      });
    }

    translateToDBType(version) {
      if (version) {
        const [type, versionNumber] = version.split('_');
        return this.getDBType({ type, versionNumber });
      }

      return null;
    }
  },
);
