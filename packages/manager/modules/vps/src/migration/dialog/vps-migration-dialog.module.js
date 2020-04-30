import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import migrationPopup from '../components/migration-popup';
import routing from './vps-migration-dialog.routing';

const moduleName = 'ovhManagerVpsMigrationDialog';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'oui',
    migrationPopup,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
