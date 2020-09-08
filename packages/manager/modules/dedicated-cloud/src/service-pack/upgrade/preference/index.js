import PreferenceService from './preference.service';

const moduleName = 'ovhManagerServicePackUpgradePreference';

angular.module(moduleName, []).service('servicePackUpgradePreferenceService', PreferenceService);

export default moduleName;
