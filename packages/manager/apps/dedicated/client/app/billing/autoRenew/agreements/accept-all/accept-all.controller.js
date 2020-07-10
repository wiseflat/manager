import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, UserAccountServicesAgreements) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.UserAccountServicesAgreements = UserAccountServicesAgreements;
  }

  $onInit() {
    this.currentAgreementIndex = 0;
    this.currentAgreement = this.agreements[this.currentAgreementIndex];
    this.AgreementUnderProcess = false;
  }

  acceptAndNext() {
    this.AgreementUnderProcess = true;
    this.UserAccountServicesAgreements.accept(this.currentAgreement)
      .then(() => {
        if (this.currentAgreementIndex !== this.agreements.length - 1) {
          this.currentAgreementIndex += 1;
          this.currentAgreement = this.agreements[this.currentAgreementIndex];
        } else {
          this.goBack(true);
        }
      })
      .catch((error) =>
        this.goBack(
          true,
          this.$translate.instant('user_agreements_accept_all_error', {
            message: get(error, 'data.message'),
          }),
          'danger',
        ),
      )
      .finally(() => {
        this.AgreementUnderProcess = false;
      });
  }
}
