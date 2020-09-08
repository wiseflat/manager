angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.license', {
    url: '/license',
    views: {
      pccView: {
        templateUrl: 'dedicatedCloud/license/dedicatedCloud-license.html',
        controller: 'ovhManagerPccLicense',
      },
    },
  });
});
