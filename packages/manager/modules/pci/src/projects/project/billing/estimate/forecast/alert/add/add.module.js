import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciProjectBillingForecastAlertAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectBillingForecastAlertAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
