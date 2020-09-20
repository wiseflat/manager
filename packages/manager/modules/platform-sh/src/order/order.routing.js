export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.order', {
    url: '/order/:projectType',
    component: 'platformShOrder',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      projectType: /* @ngInject */ ($transition$) =>
        $transition$.params().projectType,
    },
  });
};
