export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.backup.upgrade', {
    url: '/upgrade',
    params: {
      actualOffer: null,
    },
    resolve: {
      actualOffer: /* @ngInject */ ($transition$) =>
        $transition$.params().actualOffer,
    },
    views: {
      modal: {
        component: 'dedicatedCloudDatacenterBackupUpgrade',
      },
    },
    layout: 'modal',
  });
};
