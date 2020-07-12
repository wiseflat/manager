import moment from 'moment';
import { get, find } from 'lodash';
import {
  FAQ_LINK,
  MIGRATION_END_DATE,
  MIGRATION_START_DATE,
} from '../constants';

export default class MigrationNotificationController {
  /* @ngInject */
  constructor(
    $translate,
    $state,
    atInternet,
    accountMigrationService,
    RedirectionService,
  ) {
    this.$state = $state;
    this.$translate = $translate;

    this.atInternet = atInternet;
    this.accountMigrationService = accountMigrationService;
    this.RedirectionService = RedirectionService;

    this.CONTACTS_URL = this.RedirectionService.getURL('contacts');
    this.ORDERS_URL = this.RedirectionService.getURL('orders');

    this.MIGRATION_END_DATE = moment(MIGRATION_END_DATE).format('LL');
    this.MIGRATION_START_DATE = moment(MIGRATION_START_DATE).format('LL');
    this.FAQ_LINK = FAQ_LINK;

    this.migrationDetail = null;
    this.needMigration = false;
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
