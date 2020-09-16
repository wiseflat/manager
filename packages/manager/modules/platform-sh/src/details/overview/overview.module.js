import angular from 'angular';
import routing from './overview.routing';
import component from './overview.component';

const moduleName = 'ovhPlatformShDetailsOverview';

angular
  .module(moduleName, [])
  .config(routing)
  .component('platformShDetailsOverview', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
