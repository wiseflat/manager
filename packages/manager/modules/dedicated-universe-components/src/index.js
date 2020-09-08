import angular from 'angular';

import ducBandwidth from './bandwidth';
import ducBytes from './bytes';
import ducContract from './contract';
import ducNotification from './notification';
import ducPrice from './price';
import ducTabs from './tabs';
import ducTranslate from './translate';

import config from './config';
import components from './components';

const moduleName = 'ngOvhDedicatedUniverseComponents';

angular.module(moduleName, [
  ducBandwidth,
  ducBytes,
  ducContract,
  ducNotification,
  ducPrice,
  ducTabs,
  ducTranslate,
  components,
]);

export default moduleName;
