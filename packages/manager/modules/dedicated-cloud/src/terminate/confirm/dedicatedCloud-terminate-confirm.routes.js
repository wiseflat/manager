angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.terminate-confirm', {
    url: '/terminate-confirm?token',
    templateUrl:
      'dedicatedCloud/terminate/confirm/dedicatedCloud-terminate-confirm.html',
    controller: 'DedicatedCloudConfirmTerminateCtrl',
    layout: 'modal',
  });
});
