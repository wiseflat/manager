angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.users.edit', {
    url: '/edit/:userId',
    templateUrl: 'dedicatedCloud/user/edit/dedicatedCloud-user-edit.html',
    controller: 'DedicatedCloudUserEditCtrl',
    controllerAs: '$ctrl',
    layout: 'modal',
  });
});
