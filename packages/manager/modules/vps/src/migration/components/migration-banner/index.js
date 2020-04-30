import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import bannerComponent from './vps-migration-banner.component';

const moduleName = 'ovhManagerVpsMigrationBanner';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'oui',
  ])
  .component('ovhManagerVpsMigrationBanner', bannerComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
