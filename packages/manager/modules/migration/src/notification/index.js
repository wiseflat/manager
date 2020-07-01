import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import migrationNotification from './notification.component';
import migrationService from '../service';

const moduleName = 'migrationNotification';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .component('migrationNotification', migrationNotification)
  .service('migrationService', migrationService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
