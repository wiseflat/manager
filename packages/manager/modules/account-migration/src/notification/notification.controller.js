import { FAQ_LINK } from '../constants';

export default class MigrationNotificationController {
  /* @ngInject */
  constructor($translate, RedirectionService, accountMigrationService) {
    this.FAQ_LINK = FAQ_LINK;
    this.$translate = $translate;
    this.RedirectionService = RedirectionService;
    this.ORDERS_URL = this.RedirectionService.getURL('orders');
    this.CONTACTS_URL = this.RedirectionService.getURL('contacts');
    this.accountMigrationService = accountMigrationService;
  }

  $onInit() {
    this.accountMigrationService.needMigration().then((res) => {
      console.log(res);
      this.needMigration = res;
    });
    this.accountMigrationService.getMigrationDetails('1');
  }
}
