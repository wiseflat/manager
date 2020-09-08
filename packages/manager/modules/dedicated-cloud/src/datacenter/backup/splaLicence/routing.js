export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.backup.spla-licence', {
    url: '/spla-licence',
    component: 'dedicatedCloudDatacenterBackupSplaLicence',
  });
};
