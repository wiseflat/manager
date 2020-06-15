import {
  CLOUD_PROJECT_STATE,
  CLOUD_PROJECT_BILLING_STATE,
} from '../../../constants';

export default class ProjectInactiveCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.projectData = {
      isSuspended: this.projectStatus === CLOUD_PROJECT_STATE.suspended,
      hasPendingDebt:
        this.billingStatus === CLOUD_PROJECT_BILLING_STATE.PENDING_DEBT,
    };
    this.title = this.$translate.instant(
      `pci_projects_project_inactive_title${
        this.projectData.isSuspended ? '_suspended' : ''
      }${this.projectData.hasPendingDebt ? '_pending_debt' : ''}`,
    );
    this.description = this.$translate.instant(
      `pci_projects_project_inactive_description${
        this.projectData.isSuspended ? '_suspended' : ''
      }${this.projectData.hasPendingDebt ? '_pending_debt' : ''}`,
    );
  }
}
