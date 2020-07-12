import controller from './autorenew-blocked.controller';
import template from './autorenew-blocked.html';

export default {
  bindings: {
    goToAutorenew: '<',
    gotoContracts: '<',
  },
  controller,
  template,
};
