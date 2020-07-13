export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.blocked', {
    url: '/blocked',
    views: {
      modal: {
        component: 'billingAutorenewBlocked',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      gotoContracts: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name:
            'server::dedicated::account::billing::autorenew::configure-renew-impossible::go-to-agreements',
          type: 'action',
        });
        return $state.go('app.account.billing.autorenew.agreements');
      },
    },
  });
};
