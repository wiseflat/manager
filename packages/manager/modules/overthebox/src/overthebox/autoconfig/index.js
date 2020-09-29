import angular from 'angular';

import 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'ovh-api-services';

import component from './overTheBox-autoconfig.component';
import routing from './overTheBox-autoconfig.routing';

const moduleName = 'ovhManagerOtbAutoconfig';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'ui.router', 'ovh-api-services'])
  .component('overTheBoxAutoconfig', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
