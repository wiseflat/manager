import angular from 'angular';
import translate from 'angular-translate';

import moment from 'moment';

import '@ovh-ux/ng-translate-async-loader';

import accountMigrationNotification from './notification.component';

const moduleName = 'accountMigrationNotification';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', translate])
  .component('accountMigrationNotification', accountMigrationNotification)
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }
      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
