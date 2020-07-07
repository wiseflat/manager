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
    this.UserAccountServicesAgreements.accept(this.currentAgreement.contractId)
      .then(() => {
        if (this.currentAgreementIndex !== this.agreements.length - 1) {
          this.currentAgreementIndex += 1;
          this.currentAgreement = this.agreements[this.currentAgreementIndex];
        } else {
          this.goBack(
            this.$translate.instant('user_agreements_accept_all_success'),
            'success',
          );
        }
      })
      .catch((error) =>
        this.goBack(
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

  activate() {
    this.atInternet.trackClick({
      name: 'autorenew::activate',
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });

    this.isActivating = true;
    return this.activateAutorenew()
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'billing_autorenew_service_activation_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'billing_autorenew_service_activation_error',
            { message: get(error, 'data.message') },
          ),
          'danger',
        ),
      );
  }
}
