import angular from 'angular';

import acceptComponent from './accept.component';

const moduleName = 'migrationAcceptAllContracts';

angular
  .module(moduleName, [])
  .component('migrationAcceptAllContracts', acceptComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
