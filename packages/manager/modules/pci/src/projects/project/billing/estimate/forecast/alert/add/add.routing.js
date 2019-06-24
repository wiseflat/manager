export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.estimate.alert.new', {
    url: '/new',
    layout: 'modal',
    views: {
      modal: {
        component: 'pciProjectBillingForecastAlertAdd',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
