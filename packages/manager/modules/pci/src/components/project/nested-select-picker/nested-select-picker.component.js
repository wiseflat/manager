import controller from './nested-select-picker.controller';
import template from './nested-select-picker.html';

export default {
  bindings: {
    disabled: '<?',
    displayWarning: '<?',
    icon: '@',
    label: '@?',
    minDropdownLength: '<',
    model: '=',
    nestedModel: '=',
    nestedValues: '<',
    onNestedChange: '&?',
    onChange: '&?',
    value: '<',
  },
  controller,
  template,
};
