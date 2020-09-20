import angular from 'angular';

import component from './platform-sh.component';
import routing from './platform-sh.routing';

import details from './details';
import order from './order';

const moduleName = 'ovhPlatformSh';

angular
  .module(moduleName, [details, order])
  .config(routing)
  .component('platformSh', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
