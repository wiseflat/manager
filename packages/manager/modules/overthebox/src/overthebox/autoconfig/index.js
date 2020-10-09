import component from './overTheBox-autoconfig.component';
import routing from './overTheBox-autoconfig.routing';

import dhcp from './dhcp';
import dns from './dns';

const moduleName = 'ovhManagerOtbAutoconfig';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services', dhcp, dns])
  .component('overTheBoxAutoconfig', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
