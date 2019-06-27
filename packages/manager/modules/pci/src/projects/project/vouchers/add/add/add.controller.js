import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, OvhApiMe) {
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
  }

  $onInit() {
    this.isAdding = false;
  }

  addVoucher() {
    this.isAdding = true;
    return this.OvhApiMe.Credit().Code().v6().save({ inputCode: this.voucher }).$promise
      .then(() => this.goBack(
        this.$translate.instant('pci_projects_project_vouchers_add_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('pci_projects_project_vouchers_add_error', get(error, 'data.message')),
        'error',
      ));
  }
}
