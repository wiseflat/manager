import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

// import add fro../addadd';
// import credit fro../creditdit';

import component from './vouchers.component';
import service from './service';

const moduleName = 'ovhManagerPciProjectBillingVouchersLegacy';

angular
  .module(moduleName, [
    // add,
    // credit,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('pciProjectBillingVouchersLegacy', component)
  .service('CloudVouchersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
