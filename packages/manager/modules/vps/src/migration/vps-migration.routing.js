export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.migration', {
    url: '/migration',
    views: {
      // 'vpsHeader@vps': headerComponent.name,
      'vpsContainer@vps': 'ovhManagerVpsMigration',
    },
  });
};
