import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import migrationComponent from './vps-migration.component';
import migrationDialog from './dialog';
import routing from './vps-migration.routing';

const moduleName = 'ovhManagerVpsMigration';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'oui',
    migrationDialog,
  ])
  .component('ovhManagerVpsMigration', migrationComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
