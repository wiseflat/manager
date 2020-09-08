import component from './dedicatedCloud-datacenter-drp-onPremise.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.drp.onPremise', {
    url: '/onPremise',
    abstract: true,
    views: {
      'progressTrackerView@dedicatedClouds.datacenter.drp': {
        component: component.name,
      },
    },
    redirectTo: 'dedicatedClouds.datacenter.drp.onPremise.ovhPccStep',
  });
};
