export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.details', {
    url: '/details/:ovhPlatformShId',
    component: 'platformShDetails',
    redirectTo: 'platform-sh.details.overview',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      platformShId: /* @ngInject */ ($transition$) =>
        $transition$.params().ovhPlatformShId,
    },
  });
};
