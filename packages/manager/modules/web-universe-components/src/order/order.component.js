import controller from './order.controller';
import template from './order.html';

export default {
  bindings: {
    cartId: '<',
    catalog: '<',
    productName: '<',
    type: '<',
    user: '<',

    getCurrentState: '&',

    onConfigurationFinish: '&', // {'' planCode }
    onError: '&',
    onFinish: '&',
    onGetConfiguration: '&',
  },
  controller,
  name: 'wucOrder',
  template,
  transclude: true,
};
