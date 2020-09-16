export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.details.overview', {
    url: '/overview',
    component: 'platformShDetailsOverview',
  });
};
