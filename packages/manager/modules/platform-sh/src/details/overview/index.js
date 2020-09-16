import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';

const moduleName = 'ovhPlatformShDetailsOverviewLazyLoading';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
    'ovh-api-services',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('platform-sh.details.overview.**', {
        url: '/overview',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./overview.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
