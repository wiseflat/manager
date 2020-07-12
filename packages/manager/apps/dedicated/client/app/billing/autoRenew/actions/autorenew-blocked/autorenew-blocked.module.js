import component from './autorenew-blocked.component';
import routing from './autorenew-blocked.routing';

const moduleName = 'ovhManagerBillingAutorenewBlocked';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewBlocked', component);

export default moduleName;
