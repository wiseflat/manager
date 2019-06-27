import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './credit.component';

const moduleName = 'ovhManagerPciProjectVouchersCreditAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .component('pciProjectVouchersAddCredit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
