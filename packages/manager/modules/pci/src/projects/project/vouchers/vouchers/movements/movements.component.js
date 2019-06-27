import controller from './movements.controller';
import template from './movements.html';

export default {
  bindings: {
    balanceName: '<',

    movements: '<',
  },
  controller,
  template,
};
