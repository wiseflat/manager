export default class {
  /* @ngInject */
  constructor(OvhApiMe) {
    this.OvhApiMe = OvhApiMe;
  }

  getBalance({ balanceName }) {
    return this.OvhApiMe.Credit().Balance().v6().get({ balanceName }).$promise;
  }
}
