export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers.add', {
    url: '/add',
    layout: 'modal',
    views: {
      modal: {
        componentProvider: /* @ngInject */ isLegacyProject => (isLegacyProject ? 'pciProjectVouchersAddLegacy' : 'pciProjectVouchersAdd'),
      },
    },
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ goToVouchers => goToVouchers,
    },
  });
};
