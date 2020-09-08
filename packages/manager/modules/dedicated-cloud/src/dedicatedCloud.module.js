import angular from 'angular';
import set from 'lodash/set';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-dedicated-universe-components';
import '@ovh-ux/ng-ovh-doc-url';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ng-ovh-utils';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ovhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';

import { Environment } from '@ovh-ux/manager-config';

import DedicatedCloudCtrl from './dedicatedCloud.controller';
import NameEditionCtrl from './components/name-edition/name-edition.controller';
import DedicatedCloudService from './dedicatedCloud.service';
import DedicatedCloudDrpService from './datacenter/drp/dedicatedCloud-datacenter-drp.service';
import routing from './dedicatedCloud.routing';

import dashboard from './dashboard';
import servicePack from './service-pack';
// import datacenter from './datacenter';

import config from './config/config';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './dedicatedCloud.scss';

const moduleName = 'ovhManagerDedicatedCloud';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'ngOvhCloudUniverseComponents',
    'ngOvhDedicatedUniverseComponents',
    'ngOvhDocUrl',
    'ngUiRouterLayout',
    'ui.bootstrap',
    'oui',
    'ngOvhUtils',
    ngOvhFeatureFlipping,
    ovhPaymentMethod,
    ngAtInternet,
    ngAtInternetUiRouterPlugin,

    dashboard,
    servicePack,
  ])
  .config(routing)
  .controller('DedicatedCloudCtrl', DedicatedCloudCtrl)
  .controller('NameEditionCtrl', NameEditionCtrl)
  .service('DedicatedCloud', DedicatedCloudService)
  .service('dedicatedCloudDrp', DedicatedCloudDrpService)
  .config(
    /* @ngInject */ ($qProvider, ovhDocUrlProvider) => {
      ovhDocUrlProvider.setUserLocale(Environment.getUserLocale());
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .constant('constants', {
    prodMode: config.prodMode,
    swsProxyRootPath: config.swsProxyRootPath,
    aapiRootPath: config.aapiRootPath,
    target: config.target,
    renew: config.constants.RENEW_URL,
    urls: config.constants.URLS,
    UNIVERS: config.constants.UNIVERS,
    TOP_GUIDES: config.constants.TOP_GUIDES,
    vmsUrl: config.constants.vmsUrl,
    travauxUrl: config.constants.travauxUrl,
    aapiHeaderName: 'X-Ovh-Session',
    vrackUrl: config.constants.vrackUrl,
    REDIRECT_URLS: config.constants.REDIRECT_URLS,
    DEFAULT_LANGUAGE: config.constants.DEFAULT_LANGUAGE,
    FALLBACK_LANGUAGE: config.constants.FALLBACK_LANGUAGE,
    SUPPORT: config.constants.SUPPORT,
  })
  .constant('website_url', config.constants.website_url)
  .config(
    /* @ngInject */ (ovhProxyRequestProvider) => {
      ovhProxyRequestProvider.proxy('$http');
      ovhProxyRequestProvider.pathPrefix('apiv6');
    },
  )
  .config(($locationProvider) => {
    $locationProvider.hashPrefix('');
  })
  .config((tmhDynamicLocaleProvider) => {
    tmhDynamicLocaleProvider.localeLocationPattern(
      'resources/angular/i18n/angular-locale_{{locale}}.js',
    );
  })
  .config((OvhHttpProvider, constants) => {
    set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
    set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  })
  .config(($urlServiceProvider) => {
    $urlServiceProvider.rules.otherwise('/configuration');
  })
  /* ========== AT-INTERNET ========== */
  .config((atInternetProvider, atInternetUiRouterPluginProvider, constants) => {
    atInternetProvider.setEnabled(
      constants.prodMode && window.location.port.length <= 3,
    );
    atInternetProvider.setDebug(!constants.prodMode);

    atInternetUiRouterPluginProvider.setTrackStateChange(
      constants.prodMode && window.location.port.length <= 3,
    );
    atInternetUiRouterPluginProvider.addStateNameFilter((routeName) =>
      routeName
        ? routeName.replace(/^app/, 'dedicated').replace(/\./g, '::')
        : '',
    );
  });
  // .run(
  //   /* @ngInject */ ($templateCache) => {
  //     $templateCache.put(
  //       'nasha/information/nasha-information.html',
  //       informationTemplate,
  //     );
  //     $templateCache.put(
  //       'nasha/information/nasha-information-usage-help.html',
  //       usageHelpTemplate,
  //     );
  //     $templateCache.put('nasha/order/template.html', orderTemplate);
  //   },
  // );

export default moduleName;

