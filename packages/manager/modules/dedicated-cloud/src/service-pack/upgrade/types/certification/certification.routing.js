import stepModuleNames from './certification.steps';

import component from '../../upgrade.component';

export const state = {
  name: 'dedicatedClouds.servicePackUpgrade.certification',
  params: {
    activationType: 'basic',
  },
  resolve: {
    backButtonText: /* @ngInject */ ($translate) =>
      $translate.instant('ovhManagerPccServicePackUpgradeCertification_header'),
    orderableServicePacks: /* @ngInject */ (
      currentService,
      currentUser,
      UpgradeCertificationService,
    ) =>
      UpgradeCertificationService.getOrderableServicePacks(
        currentService.name,
        currentUser.ovhSubsidiary,
      ),
    steps: /* @ngInject */ (pccServicePackUpgradeService) =>
      pccServicePackUpgradeService.buildSteps(stepModuleNames),
  },
  translations: {
    format: 'json',
    value: ['.'],
  },
  url: '/certification',
  views: {
    'pccView@dedicatedClouds': component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
