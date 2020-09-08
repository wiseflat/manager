import { BACKUP_MINIMUM_HOST_COUNT } from '../backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.datacenter.backup.minimum-hosts', {
    url: '/minimum-hosts',
    component: 'dedicatedCloudDatacenterBackupMinimumHosts',
    resolve: {
      goToOrderHosts: /* @ngInject */ ($state, productId, datacenterId) => () =>
        $state.go('dedicatedClouds.datacenter.hosts.order', {
          datacenterId,
          productId,
        }),
      minimumHosts: () => BACKUP_MINIMUM_HOST_COUNT,
    },
  });
};
