import controller from './wrapper.controller';
import template from './wrapper.html';

export default {
  bindings: {
    model: '=',
    disabled: '<?',
  },
  controller,
  template,
};
