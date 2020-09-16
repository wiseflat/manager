export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.details.users', {
    url: '/users',
    component: 'platformShDetailsUsers',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
