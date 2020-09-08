angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.dashboard', {
    views: {
      'pccDatacenterView@dedicatedClouds.datacenter': {
        templateUrl:
          'dedicatedCloud/datacenter/dashboard/dedicatedCloud-datacenter-dashboard.html',
      },
    },
  });
});
