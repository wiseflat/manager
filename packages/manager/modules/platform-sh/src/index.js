import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhPlatformShLazyLoading';

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
      $stateProvider.state('platform-sh.**', {
        url: '/platform-sh',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./platform-sh.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
