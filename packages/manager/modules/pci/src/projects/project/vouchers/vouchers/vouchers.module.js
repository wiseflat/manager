import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import movements from './movements';

import component from './vouchers.component';

const moduleName = 'ovhManagerPciProjectBillingVouchersBalance';

angular
  .module(moduleName, [
    movements,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('pciProjectBillingVouchers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
