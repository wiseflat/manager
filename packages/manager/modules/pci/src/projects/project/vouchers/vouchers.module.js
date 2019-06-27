import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import legacy from './legacy/vouchers.module';
import vouchers from './vouchers/vouchers.module';
import add from './add';
import credit from './credit';

import routing from './vouchers.routing';

const moduleName = 'ovhManagerPciProjectBillingVouchers';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    add,
    credit,
    legacy,
    vouchers,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
