export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.contact',
    {
      url: '/contact',
      views: {
        'faxInnerView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl: 'app/telecom/telephony/service/contact/contact.html',
          controller: 'TelecomTelephonyServiceContactCtrl',
          controllerAs: 'ServiceContactCtrl',
        },
      },
    },
  );
};
