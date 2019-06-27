import filter from 'lodash/filter';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';

import { VOUCHER_PREFIX } from './vouchers.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers', {
    url: '/vouchers',
    componentProvider: /* @ngInject */ isLegacyProject => (isLegacyProject ? 'pciProjectBillingVouchersLegacy' : 'pciProjectBillingVouchers'),
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('cpb_project_management_credit_vouchers'),
      balances: /* @ngInject */ OvhApiMe => OvhApiMe.Credit().Balance().v6().query().$promise
        .then(balances => map(
          filter(
            balances,
            balanceName => startsWith(balanceName, VOUCHER_PREFIX),
          ),
          balanceName => ({ balanceName }),
        )),
      goToBalanceDetails: /* @ngInject */ (
        $state,
        projectId,
      ) => balanceName => $state.go('pci.projects.project.vouchers.movements', {
        projectId,
        balanceName,
      }),
      goToVouchers: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('pci.projects.project.vouchers', {
          projectId,
        },
        {
          reload,
        });

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.vouchers'));
        }

        return promise;
      },
      addVoucher: /* @ngInject */ (
        $state,
        projectId,
      ) => () => $state.go('pci.projects.project.vouchers.add', {
        projectId,
      }),
      buyCredit: /* @ngInject */ (
        $state,
        projectId,
      ) => () => $state.go('pci.projects.project.vouchers.credit', {
        projectId,
      }),
    },
  });
};
