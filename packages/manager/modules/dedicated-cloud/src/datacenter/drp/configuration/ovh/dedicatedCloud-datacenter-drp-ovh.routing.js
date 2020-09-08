import component from './dedicatedCloud-datacenter-drp-ovh.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.drp.ovh', {
    url: '/ovh',
    abstract: true,
    views: {
      'progressTrackerView@dedicatedClouds.datacenter.drp': {
        component: component.name,
      },
    },
    redirectTo: 'dedicatedClouds.datacenter.drp.ovh.mainPccStep',
  });
};
