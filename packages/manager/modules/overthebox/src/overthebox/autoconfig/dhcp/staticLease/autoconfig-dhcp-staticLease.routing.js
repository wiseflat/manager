export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.autoconfig.dhcpStaticLease', {
    url: '/dhcpStaticLease',
    views: {
      modal: {
        component: 'autoconfigDhcpStaticLease',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('overTheBoxes.overTheBox.autoconfig'),
    },
  });
};
