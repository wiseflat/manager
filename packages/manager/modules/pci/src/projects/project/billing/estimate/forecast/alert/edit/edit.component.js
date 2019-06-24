import controller from './edit.controller';
import template from './add.html';

export default {
  bindings: {
    alert: '<',
    goBack: '<',
    projectId: '<',
    user: '<',
  },
  controller,
  template,
};
