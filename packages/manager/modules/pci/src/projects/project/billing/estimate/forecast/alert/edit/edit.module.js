import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciProjectBillingForecastAlertEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectBillingForecastAlertEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
