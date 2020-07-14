import moment from 'moment';
import { FAQ_LINK } from '../constants';

export default class MigrationNotificationController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $state,
    atInternet,
    accountMigrationService,
    OvhApiMe,
    RedirectionService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;

    this.atInternet = atInternet;
    this.accountMigrationService = accountMigrationService;
    this.OvhApiMe = OvhApiMe;
    this.RedirectionService = RedirectionService;

    this.AGREEMENTS_URL = this.RedirectionService.getURL('agreements');
    this.CONTACTS_URL = this.RedirectionService.getURL('contacts');
    this.ORDERS_URL = this.RedirectionService.getURL('orders');

    this.migrationDetail = null;
    this.needMigration = false;
  }

  $onInit() {
    return this.$q
      .all([
        this.accountMigrationService.getMigrationList(),
        this.accountMigrationService.getMigrationDates(),
      ])
      .then(([[migration], migrationDates]) => {
        if (migration) {
          this.faqLink = FAQ_LINK[migration.from];
          if (migrationDates) {
            this.migrationStartDate = moment(
              migrationDates.START,
              'MM/DD/YYYY',
            ).format('LL');
            this.migrationEndDate = moment(
              migrationDates.END,
              'MM/DD/YYYY',
            ).format('LL');
          }
          return this.accountMigrationService
            .getMigrationDetails(migration.id)
            .then((res) => {
              this.migrationDetail = res;
            });
        }
        return null;
      });
  }

  trackClick(type) {
    let trackText = null;
    switch (type) {
      case 'billing':
        trackText =
          'bills:server::dedicated::account::billing::alert::go-to-billing-link';
        break;
      case 'debt':
        trackText = 'dedicated::account::billing:main::balance-payment';
        break;
      case 'faq':
        trackText = 'alert::notifications::go-to-faq-agreement';
        break;
      default:
        trackText = type;
    }

    this.atInternet.trackClick({
      name: trackText,
      type: 'action',
    });
  }
}
