export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.estimate.alert', {
    url: '/alert',
    abstract: true,
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goBack: /* @ngInject */ goToEstimate => goToEstimate,
    },
  });
};
