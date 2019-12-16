import controller from './order.controller';
import template from './order.html';

export default {
  bindings: {
    onFinish: '@',
  },
  name: 'wucOrder',
  template,
  transclude: true,
};
