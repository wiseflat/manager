export const state = {
  abstract: true,
  name: 'dedicatedClouds.servicePackUpgrade',
  resolve: {
    goBack: /* @ngInject */ ($state) => () => $state.go('dedicatedClouds'),
  },
  translations: {
    format: 'json',
    value: ['.'],
  },
  url: '/servicePackUpgrade',
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
