import get from 'lodash/get';

import { DELAY } from '../alert.constants';

export default class {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectAlerting) {
    this.$translate = $translate;
    this.OvhApiCloudProjectAlerting = OvhApiCloudProjectAlerting;
  }

  $onInit() {
    this.alert = {
      delay: DELAY,
      email: null,
      monthmyThreshold: 0,
    };
  }

  createAlert() {
    return this.OvhApiCloudProjectAlerting.v6().save({
      serviceName: this.projectId,
    }, this.alert).$promise.then(() => this.goBack(
      this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_add_success'),
    ))
      .catch(error => this.goBack(
        this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_add_error', { message: get(error, 'data.message') }),
        'error',
      ));
  }
}
