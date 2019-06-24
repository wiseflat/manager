import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './forecast.component';

const moduleName = 'ovhManagerPciProjectBillingForecast';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('pciProjectBillingForecast', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
