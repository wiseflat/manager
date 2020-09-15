import angular from 'angular';

import component from './platform-sh.component';
import routing from './platform-sh.routing';

const moduleName = 'ovhPlatformSh';

angular
  .module(moduleName, [])
  .config(routing)
  .component('platformSh', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
