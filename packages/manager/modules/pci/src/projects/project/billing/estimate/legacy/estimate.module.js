import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import legacyComponent from './estimate.component';

const moduleName = 'ovhManagerPciProjectBillingEstimateLegacy';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('pciProjectBillingEstimateLegacy', legacyComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
