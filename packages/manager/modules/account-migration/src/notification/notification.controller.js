import moment from 'moment';
import {
  FAQ_LINK,
  MIGRATION_END_DATE,
  MIGRATION_START_DATE,
} from '../constants';

export default class MigrationNotificationController {
  /* @ngInject */
  constructor($translate, RedirectionService, accountMigrationService) {
    this.FAQ_LINK = FAQ_LINK;
    this.$translate = $translate;
    this.RedirectionService = RedirectionService;
    this.ORDERS_URL = this.RedirectionService.getURL('orders');
    this.CONTACTS_URL = this.RedirectionService.getURL('contacts');
    this.accountMigrationService = accountMigrationService;
    this.needMigration = false;
    this.migrationDetail = null;
    this.MIGRATION_END_DATE = moment(MIGRATION_END_DATE).format('LL');
    this.MIGRATION_START_DATE = moment(MIGRATION_START_DATE).format('LL');
  }

  $onInit() {
    this.accountMigrationService.getMigrationList().then((res) => {
      if (res[0].status === 'TODO') {
        this.needMigration = true;
      }
    });

    this.accountMigrationService.getDetailedList().then((res) => {
      this.migrationDetail = res;
    });
  }
}
