import angular from 'angular';
import 'ovh-ui-angular';

import './nested-select-picker.less';

import component from './nested-select-picker.component';

const moduleName = 'ovhManagerPciNestedSelectPicker';

angular
  .module(moduleName, ['oui'])
  .component('pciNestedSelectPicker', component);

export default moduleName;
