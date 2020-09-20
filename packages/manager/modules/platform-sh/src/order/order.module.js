import angular from 'angular';

import component from './order.component';
import routing from './order.routing';

const moduleName = 'ovhPlatformShOrder';

angular
  .module(moduleName, [])
  .config(routing)
  .component('platformShOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
