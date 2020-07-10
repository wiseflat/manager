import angular from 'angular';

import accountMigrationNotification from './notification';
import accountMigrationService from './service';

const moduleName = 'ngOvhAccountMigrationComponents';

angular
  .module(moduleName, [accountMigrationNotification])
  .service('accountMigrationService', accountMigrationService);

export default moduleName;
