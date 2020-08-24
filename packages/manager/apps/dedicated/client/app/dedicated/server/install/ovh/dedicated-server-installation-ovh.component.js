import controller from './dedicated-server-installation-ovh.controller';
import template from './dedicated-server-installation-ovh.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
  },
  controller,
  template,
};
