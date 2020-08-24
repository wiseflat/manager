import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './dedicated-server-installation-choice.component';

const moduleName = 'ovhManagerDedicatedServerInstallationChoice';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('dedicatedServerInstallationChoice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
