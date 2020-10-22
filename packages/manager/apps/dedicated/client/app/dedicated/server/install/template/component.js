import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallTemplate',
  bindings: {
    server: '<',
  },
  controller,
  template,
};
