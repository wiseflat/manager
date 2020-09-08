import component from './dedicatedCloud-datacenter-drp-summary.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.drp.summary', {
    url: '/summary',
    views: {
      'innerView@dedicatedClouds.datacenter.drp': {
        component: component.name,
      },
    },
    params: {
      drpInformations: {},
    },
    resolve: {
      goToDeleteDrpModal: /* @ngInject */ ($state) => () =>
        $state.go('dedicatedClouds.datacenter.drp.summary.deleteDrp'),
    },
  });
};
