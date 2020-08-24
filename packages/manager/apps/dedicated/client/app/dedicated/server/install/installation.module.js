import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import choice from './choice';
import component from './installation.component';
import routing from './installation.routing';

const moduleName = 'ovhManagerDedicatedServerInstallation';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    choice,
  ])
  .config(routing)
  .component('dedicatedServerInstallation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
