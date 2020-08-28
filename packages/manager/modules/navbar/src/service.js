export default class {
  /* @ngInject */
  constructor(OvhApiUniverses) {
    this.OvhApiUniverses = OvhApiUniverses;
  }

  getUniverses(version) {
    return this.OvhApiUniverses.Aapi().query({
      version,
    }).$promise;
  }
}
