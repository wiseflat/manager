import moment from 'moment';
import { get, find } from 'lodash';
import { FAQ_LINK } from '../constants';

export default class MigrationNotificationController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $state,
    atInternet,
    accountMigrationService,
    RedirectionService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;

    this.atInternet = atInternet;
    this.accountMigrationService = accountMigrationService;
    this.RedirectionService = RedirectionService;

    this.CONTACTS_URL = this.RedirectionService.getURL('contacts');
    this.ORDERS_URL = this.RedirectionService.getURL('orders');

    this.FAQ_LINK = FAQ_LINK;

    this.migrationDetail = null;
    this.needMigration = false;
  }

  $onInit() {
    return this.$q
      .all([
        this.accountMigrationService.getPendingMigration(),
        this.accountMigrationService.getMigrationDates(),
      ])
      .then(([migration, migrationDates]) => {
        this.needMigration =
          typeof migration !== 'undefined' && migration.status === 'TODO';
        if (this.needMigration) {
          this.migrationStartDate = moment(
            migrationDates.START,
            'MM/DD/YYYY',
          ).format('LL');
          this.migrationEndDate = moment(
            migrationDates.END,
            'MM/DD/YYYY',
          ).format('LL');
          return this.accountMigrationService.getDetailedList().then((res) => {
            this.migrationDetail = res;
          });
        }
        return null;
      });
  }

  goToAcceptAllAgreements() {
    this.trackClick(
      'server::dedicated::account::billing::autorenew::agreements::go-to-accept-agreement',
    );

    const contracts = find(
      this.migrationDetail.steps,
      (step) => step.name === 'CONTRACTS',
    );

    this.$state.go('app.account.billing.autorenew.agreements.accept-all', {
      agreements: get(contracts, 'contracts.agreements'),
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
