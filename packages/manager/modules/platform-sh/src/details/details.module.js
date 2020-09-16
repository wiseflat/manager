import angular from 'angular';

import component from './details.component';
import overview from './overview';
import routing from './details.routing';
import users from './users';

const moduleName = 'ovhCloudConnectDetails';

angular
  .module(moduleName, [overview, users])
  .config(routing)
  .component('platformShDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
