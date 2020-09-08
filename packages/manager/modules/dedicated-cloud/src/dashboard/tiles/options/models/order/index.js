import preference from '../../../../../service-pack/upgrade/preference';

import OptionsService from './order.service';

const moduleName = 'ovhManagerPccDashboardOptionsOrder';

angular.module(moduleName, [preference]).service('ovhManagerPccDashboardOptionsOrderService', OptionsService);

export default moduleName;
