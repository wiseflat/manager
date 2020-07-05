import { FAQ_LINK } from '../constants';

export default class MigrationNotificationController {
  /* @ngInject */
  constructor($translate, RedirectionService) {
    this.FAQ_LINK = FAQ_LINK;
    this.$translate = $translate;
    this.RedirectionService = RedirectionService;
    this.BILLING_URL = this.RedirectionService.getURL('billing');
    this.ORDERS_URL = this.RedirectionService.getURL('orders');
    this.CONTACTS_URL = this.RedirectionService.getURL('contacts');
  }
}
