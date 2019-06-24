import controller from './estimate.controller';
import template from './estimate.html';

export default {
  bindings: {
    alert: '<',
  },
  controller,
  controllerAs: 'BillingConsumptionEstimateCtrl',
  template,
};
