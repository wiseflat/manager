export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.migration.dialog', {
    url: '/dialog',
    views: {
      modal: {
        component: 'ovhManagerVpsMigrationPopup',
      },
    },
    layout: 'modal',
  });
};
