import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.estimate', {
    url: '/estimate',
    componentProvider: /* @ngInject */ isLegacyProject => (isLegacyProject ? 'pciProjectBillingEstimateLegacy' : 'pciProjectBillingForecast'),
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_billing_forecast'),

      alert: /* @ngInject */ (
        OvhApiCloudProjectAlerting,
        projectId,
      ) => OvhApiCloudProjectAlerting.v6().getIds({
        serviceName: projectId,
      }).$promise
        .then(([alertId]) => (alertId ? OvhApiCloudProjectAlerting.v6().get({
          serviceName: projectId,
          alertId,
        }) : null)),
      createAlertLink: /* @ngInject */ (
        $state,
        projectId,
      ) => $state.href('pci.projects.project.billing.estimate.alert.add', { projectId }),
      editAlertLink: /* @ngInject */ (
        $state,
        alert,
        projectId,
      ) => $state.href('pci.projects.project.billing.estimate.alert.edit', { projectId, alertId: alert.id }),
      hourlyForeast: /* @ngInject */ (
        isLegacyProject,
        OvhApiMeConsumption,
        serviceInfos,
      ) => (isLegacyProject ? null : OvhApiMeConsumption.Usage().Forecast().v6().get().$promise
        .then(forecast => find(forecast, { serviceId: serviceInfos.serviceId }))),
      monthlyForecast: /* @ngInject */ (
        isLegacyProject,
        OvhApiServiceRenewForecast,
        serviceInfos,
      ) => (isLegacyProject ? null : OvhApiServiceRenewForecast.v6()
        .get({ serviceId: serviceInfos.serviceId, includeOptions: true }).$promise),
      goToEstimate: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('pci.projects.project.billing.estimate', {
          projectId,
        },
        {
          reload,
        });

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.billing.estimate'));
        }

        return promise;
      },
    },
  });
};
