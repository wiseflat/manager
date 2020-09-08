angular.module('App').config(($stateProvider) => {
  $stateProvider.state('dedicatedClouds.operation', {
    url: '/operation',
    reloadOnSearch: false,
    views: {
      pccView: {
        templateUrl: 'dedicatedCloud/operation/dedicatedCloud-operation.html',
        controller: 'DedicatedCloudOperationsCtrl',
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      goToExecutionDateEdit: /* @ngInject */ ($state, $transition$) => (task) =>
        $state.go('dedicatedClouds.operation.execution-date-edit', {
          productId: $transition$.params().productId,
          operationToEdit: task,
        }),
    },
    translations: { value: ['./executionDateEdit'], format: 'json' },
  });
});
