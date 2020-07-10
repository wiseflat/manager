import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import accountMigrationNotification from './notification.component';
import faqLinkDirective from './faq-link.directive';

const moduleName = 'accountMigrationNotification';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .directive('accountMigrationFaqLink', faqLinkDirective)
  .component('accountMigrationNotification', accountMigrationNotification)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
