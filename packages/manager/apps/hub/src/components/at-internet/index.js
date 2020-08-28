import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ovhManagerCore from '@ovh-ux/manager-core';
import { Environment } from '@ovh-ux/manager-config';

import TRACKING from './at-internet.constant';

const moduleName = 'hubAtInternet';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
  ])
  .config(
    /* @ngInject */ (atInternetProvider, atInternetUiRouterPluginProvider) => {
      const trackingEnabled = __NODE_ENV__ === 'production';

      atInternetProvider.setEnabled(trackingEnabled);
      atInternetProvider.setDebug(!trackingEnabled);

      atInternetUiRouterPluginProvider.setTrackStateChange(true);
      atInternetUiRouterPluginProvider.addStateNameFilter((routeName) => {
        const prefix = 'hub';
        const route = routeName ? routeName.replace(/\./g, '::') : '';
        return `${prefix}::${route}`;
      });
    },
  )
  .run(
    /* @ngInject */ (atInternet, coreConfig) => {
      const config = TRACKING[coreConfig.getRegion()] || {};
      config.countryCode = Environment.getUser().country;
      config.currencyCode =
        Environment.getUser().currency && Environment.getUser().currency.code;
      config.visitorId = Environment.getUser().customerCode;
      atInternet.setDefaults(config);
    },
  );

export default moduleName;
