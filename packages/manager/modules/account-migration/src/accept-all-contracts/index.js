import angular from 'angular';

import acceptComponent from './accept.component';

const moduleName = 'accountMigrationAcceptAllContracts';

angular
  .module(moduleName, [])
  .component('accountMigrationAcceptAllContracts', acceptComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
