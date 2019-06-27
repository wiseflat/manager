export default class {
  /* @ngInject */
  constructor(OvhApiMe) {
    this.OvhApiMe = OvhApiMe;
  }

  getMovement({ movementId }) {
    return this.OvhApiMe.Credit().Balance().Movement().v6()
      .get({ balanceName: this.balanceName, movementId }).$promise;
  }
}
