export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh', {
    url: '/platform-sh',
    component: 'platformSh',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
