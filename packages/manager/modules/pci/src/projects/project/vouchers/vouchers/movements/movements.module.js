import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './movements.component';
import routing from './movements.routing';

const moduleName = 'ovhManagerPciProjectBillingVouchersMovements';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectBillingVouchersMovements', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
