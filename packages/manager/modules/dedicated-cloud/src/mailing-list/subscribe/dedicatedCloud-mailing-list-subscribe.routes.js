angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.ml-subscribe', {
    url: '/ml-subscribe',
    templateUrl:
      'dedicatedCloud/mailing-list/subscribe/dedicatedCloud-mailing-list-subscribe.html',
    controller: 'DedicatedCloudMailingCtrl',
    layout: 'modal',
  });
});
