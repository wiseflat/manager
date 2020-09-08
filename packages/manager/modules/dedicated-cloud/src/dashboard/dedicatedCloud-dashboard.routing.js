export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicatedClouds.dashboard', {
    views: {
      pccView: 'pccDashboard',
    },
    resolve: {
      isMailingListSubscriptionAvailable: /* @ngInject */ (
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('dedicated-cloud:mailingListSubscription')
          .then(
            (featureAvailability) =>
              featureAvailability.isFeatureAvailable(
                'dedicated-cloud:mailingListSubscription',
              ),
          ),
    },
  });
};
