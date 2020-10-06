export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.autoconfig', {
    url: '/autoconfig',
    views: {
      otbView: 'overTheBoxAutoconfig',
    },
    resolve: {
      goToAutoconfig: /* @ngInject */ ($state) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'overTheBoxes.overTheBox.autoconfig',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => {
            // TucToast[type](message);
          });
        }
        return promise;
      },
    },
  });
};
