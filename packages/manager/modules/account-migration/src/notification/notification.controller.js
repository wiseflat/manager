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
    this.accountMigrationService.getMigrationList().then(({ status }) => {
      if (status === 'TODO') {
        this.needMigration = true;
      }
    });

    this.accountMigrationService.getDetailedList().then((res) => {
      console.log(res.hasOrderPending());
    });
  }
}
