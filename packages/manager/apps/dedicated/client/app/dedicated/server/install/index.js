import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

const moduleName = 'ovhManagerDedicatedServerInstallationLazyloading';

angular
  .module(moduleName, ['ui.router', 'ovhManagerCore', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated.server.installation.**', {
        url: '/installation',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./installation.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
