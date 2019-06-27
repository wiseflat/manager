import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers.movements', {
    url: '/:balanceName',
    component: 'pciProjectBillingVouchersMovements',
    resolve: {
      breadcrumb: /* @ngInject */ balanceName => balanceName,
      balanceName: /* @ngInject */  $transition$ => $transition$.params().balanceName,
      movements: /* @ngInject */ (
        balanceName,
        OvhApiMe,
      ) => OvhApiMe.Credit().Balance().Movement().v6()
        .query({ balanceName }).$promise.then(
          movements => map(movements, movementId => ({ movementId })),
        ),
    },
  });
};
