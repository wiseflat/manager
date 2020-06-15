import { CLOUD_PROJECT_STATE, CLOUD_PROJECT_BILLING_STATE } from '../constants';

export default class Project {
  /* @ngInject */
  constructor(project) {
    Object.assign(this, project);
  }

  isCreating() {
    return this.status === CLOUD_PROJECT_STATE.creating;
  }

  isDeleting() {
    return this.status === CLOUD_PROJECT_STATE.deleting;
  }

  isSuspended() {
    return this.status === CLOUD_PROJECT_STATE.suspended;
  }

  hasPendingDebt() {
    return (
      this.serviceInfo &&
      this.serviceInfo.status === CLOUD_PROJECT_BILLING_STATE.PENDING_DEBT
    );
  }

  isDeleted() {
    return this.status === CLOUD_PROJECT_STATE.deleted;
  }

  isActive() {
    return this.status === CLOUD_PROJECT_STATE.ok;
  }
}
