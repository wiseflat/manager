import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './credit.component';

const moduleName = 'ovhManagerPciProjectVouchersCreditLegacy';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .component('pciProjectvouchersCreditLegacy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
