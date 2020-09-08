angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.security', {
    url: '/security',
    reloadOnSearch: false,
    views: {
      pccView: {
        templateUrl: 'dedicatedCloud/security/dedicatedCloud-security.html',
        controller: 'DedicatedCloudSecurityCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
});
