import component from './accept-all.component';
import routing from './accept-all.routes';

const moduleName = 'ovhManagerBillingAutorenewActivation';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewActivation', component);

export default moduleName;
