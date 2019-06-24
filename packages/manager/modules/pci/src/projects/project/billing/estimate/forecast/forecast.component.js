import controller from './forecast.controller';
import template from './forecast.html';

export default {
  bindings: {
    alert: '<',
    consumption: '<',
    hourlyForecast: '<',
    monthlyForecast: '<',
    user: '<',
  },
  controller,
  template,
};
