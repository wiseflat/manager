import angular from 'angular';

import component from './users.component';
import routing from './users.routing';

const moduleName = 'ovhPlatformShDetailsUsers';

angular
  .module(moduleName, [])
  .config(routing)
  .component('platformShDetailsUsers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
