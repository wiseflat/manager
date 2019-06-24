import find from 'lodash/find';

import controller from './billing.controller';
import template from './billing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing', {
    url: '/billing',
    controller,
    controllerAs: 'BillingCtrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('cpbc_billing_control'),
      consumption: /* @ngInject */ (
        isLegacyProject,
        OvhApiMeConsumption,
        serviceInfos,
      ) => (isLegacyProject ? null : OvhApiMeConsumption.Usage().Current().v6().get().$promise
        .then(consumption => find(consumption, { serviceId: serviceInfos.serviceId }))),
      serviceInfos: /* @ngInject */ (
        OvhApiCloudProject,
        projectId,
      ) => OvhApiCloudProject.ServiceInfos().v6().get({
        serviceName: projectId,
      }).$promise,
    },
  });
};
