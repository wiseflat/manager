export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.installation', {
    url: '/installation',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInstallation',
      },
    },
    resolve: {
      goBack: /* @ngInject */ ($state, Alerter) => (
        params = {},
        transitionParams,
      ) => {
        const promise = $state.go(
          'app.dedicated.server.dashboard',
          params,
          transitionParams,
        );

        const { message } = params;
        if (message) {
          promise.then(() => {
            Alerter.alertFromSWS(
              message.text,
              message.type,
              message.id || 'server_dashboard_alert',
            );
          });
        }

        return promise;
      },
    },
  });
};
