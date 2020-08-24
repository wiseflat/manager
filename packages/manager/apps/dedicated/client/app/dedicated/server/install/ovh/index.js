import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './dedicated-server-installation-ovh.component';

const moduleName = 'ovhManagerDedicatedServerInstallationOvh';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('dedicatedServerInstallationOvh', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
