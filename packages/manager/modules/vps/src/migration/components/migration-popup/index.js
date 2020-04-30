import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import popupComponent from './vps-migration-popup.component';

const moduleName = 'ovhManagerVpsMigrationPopup';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'oui',
  ])
  .component('ovhManagerVpsMigrationPopup', popupComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
