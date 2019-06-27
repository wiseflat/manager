import find from 'lodash/find';
import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers.credit', {
    url: '/credit',
    layout: 'modal',
    views: {
      modal: {
        componentProvider: /* @ngInject */ isLegacyProject => (isLegacyProject ? 'pciProjectVouchersAddCreditLegacy' : 'pciProjectVouchersAddCredit'),
      },
    },
    resolve: {
      breadcrumb: () => null,
      unitaryPrice: /* @ngInject */
      (
        isLegacyProject,
        OvhApiOrderCatalogFormatted,
        user,
      ) => (
      // prevent fetching heavy catalog if not needed
        isLegacyProject ? null : OvhApiOrderCatalogFormatted.v6().get({ catalogName: 'cloud', ovhSubsidiary: user.ovhSubsidiary }).$promise
          .then(({ plans }) => {
            const defaultCreditPrices = get(
              find(plans, { planCode: 'credit', pricingType: 'purchase' }),
              'details.pricings.default',
            );
            const creditPrice = get(
              find(defaultCreditPrices, ({ capacities }) => capacities.includes('installation')),
              'price',
            );
            return creditPrice;
          })),
      goBack: /* @ngInject */ goToVouchers => goToVouchers,
    },
  });
};
