import component from './autoconfig-dhcp-config.component';
import routing from './autoconfig-dhcp-config.routing';

const moduleName = 'ovhManagerOtbAutoconfigDhcpConfig';

angular
  .module(moduleName, ['ui.router', 'ovh-api-services'])
  .component('autoconfigDhcpConfig', component)
  .config(routing);

export default moduleName;
