import controller from '../legacy/credit.controller';
import template from './credit.html';

export default {
  bindings: {
    goBack: '<',
    unitaryPrice: '<',
    user: '<',
  },
  controller,
  template,
};
