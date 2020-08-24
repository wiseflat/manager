import controller from './installation.controller';
import template from './installation.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
  },
  controller,
  template,
};
