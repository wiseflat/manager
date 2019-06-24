export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.estimate.alert.edit', {
    url: '/edit/:alertId',
    layout: 'modal',
    views: {
      modal: {
        component: 'pciProjectBillingForecastAlertEdit',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
