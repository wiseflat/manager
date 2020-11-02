import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class TelecomTelephonyController extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, $window, ouiDatagridService) {
    super($q, ouiDatagridService);
    this.$http = $http;
    this.$translate = $translate;
    this.$window = $window;
  }

  $onInit() {
    this.datagridId = 'dg-telephony-billingAccounts';
    this.defaultFilterColumn = 'billingAccount';
    this.isActive = false;

    this.stencilModel = {
      firstName: '',
    };

    this.testItems = [1, 2, 3];
    super.$onInit();

    this.filtersOptions = {
      status: {
        hideOperators: true,
        values: this.telephonyStatusTypes.reduce(
          (statusTypes, statusType) => ({
            ...statusTypes,
            [statusType]: this.$translate.instant(
              `telephony_status_label_${statusType}`,
            ),
          }),
          {},
        ),
      },
    };

    this.columnsConfig = [
      { name: 'billingAccount', sortable: this.getSorting('billingAccount') },
      { name: 'description', sortable: this.getSorting('description') },
      { name: 'numServices', sortable: false },
      {
        name: 'currentOutplan.value',
        sortable: this.getSorting('currentOutplan.value'),
      },
      {
        name: 'securityDeposit.value',
        sortable: this.getSorting('securityDeposit.value'),
      },
      { name: 'status', sortable: this.getSorting('status') },
    ];
  }

  callExposedMethod() {
    return this.stencilModel.exposedMethod();
  }

  fooFunction() {
    return this.$http.get('/me').then((user) => {
      console.log(user);
    });
  }

  dispatchEvent() {
    this.stencilModel.isBusy = false;
    this.$window.dispatchEvent(
      new CustomEvent('onWindowEvent', {
        detail: false,
      }),
    );
  }
}
