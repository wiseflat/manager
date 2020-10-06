export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.autoconfig.dhcpConfig', {
    url: '/dhcpConfig',
    views: {
      modal: {
        component: 'autoconfigDhcpConfig',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('overTheBoxes.overTheBox.autoconfig'),
    },
  });
};
