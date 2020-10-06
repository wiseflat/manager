import config from './config';
import staticLease from './staticLease';

import component from './autoconfig-dhcp.component';

const moduleName = 'ovhManagerOtbAutoconfigDhcp';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services', config, staticLease])
  .component('autoconfigDhcp', component);

export default moduleName;
