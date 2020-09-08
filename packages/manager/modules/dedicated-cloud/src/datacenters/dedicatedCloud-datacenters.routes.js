angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenters', {
    url: '/datacenters',
    reloadOnSearch: false,
    views: {
      pccView: {
        templateUrl:
          'dedicatedCloud/datacenters/dedicatedCloud-datacenters.html',
        controller: 'DedicatedCloudDatacentersCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
});
