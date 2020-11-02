import controller from './wrapper.controller';
import template from './wrapper.html';

export default {
  bindings: {
    selectionCount: '<',
    selection: '<',
    isActive: '<',
    items: '<',
    model: '=',
    name: '@',
    clickCallback: '&',
    exposedMethod: '=?',
  },
  controller,
  template,
};
