export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.backup.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'dedicatedCloudDatacenterBackupDelete',
      },
    },
    layout: 'modal',
  });
};
