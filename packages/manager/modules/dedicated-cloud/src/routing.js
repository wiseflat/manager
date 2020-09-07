export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app', {
      url: '/dedicated-cloud',
      component: 'dedicatedCloud',
    });
};
