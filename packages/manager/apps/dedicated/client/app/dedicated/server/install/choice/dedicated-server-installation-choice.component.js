import controller from './dedicated-server-installation-choice.controller';
import template from './dedicated-server-installation-choice.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
    setChoice: '<',
  },
  controller,
  template,
};
