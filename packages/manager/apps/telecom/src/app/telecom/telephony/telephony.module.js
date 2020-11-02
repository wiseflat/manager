import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './telephony.component';
import routing from './telephony.routing';
import wrapper from './componentWrapper/wrapper.component';
import checkboxWrapper from './checkboxWrapper/wrapper.component';

const moduleName = 'ovhManagerTelecomTelephony';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('telecomTelephony', component)
  .component('componentWrapper', wrapper)
  .component('checkboxWrapper', checkboxWrapper)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
