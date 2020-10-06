import component from './autoconfig-dhcp-staticLease.component';
import routing from './autoconfig-dhcp-staticLease.routing';

const moduleName = 'ovhManagerOtbAutoconfigDhcpStaticLease';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigDhcpStaticLease', component)
  .config(routing);

export default moduleName;
