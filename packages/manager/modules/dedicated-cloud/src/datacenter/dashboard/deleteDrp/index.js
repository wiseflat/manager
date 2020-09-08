import component from '../../drp/summary/delete/dedicatedCloud-datacenter-drp-summary-delete.component';

const moduleName = 'dedicatedCloudDatacenterDashboardDeleteDrpModule';

angular.module(moduleName, []).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('dedicatedClouds.datacenter.dashboard.deleteDrp', {
      url: '/deleteDrp',
      views: {
        modal: {
          component: component.name,
        },
      },
      layout: 'modal',
      resolve: {
        drpInformations: /* @ngInject */ (currentDrp, dedicatedCloudDrp) =>
          dedicatedCloudDrp.constructor.getPlanServiceInformations(currentDrp),

        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      },
    });
  },
);

export default moduleName;
