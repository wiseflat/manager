import template from './inactive.html';
import controller from './inactive.controller';

export default {
  template,
  controller,
  bindings: {
    billingStatus: '<',
    billingUrl: '<',
    goBack: '<',
    goToBilling: '<',
    goToProject: '<',
    projectId: '<',
    projectStatus: '<',
  },
};
