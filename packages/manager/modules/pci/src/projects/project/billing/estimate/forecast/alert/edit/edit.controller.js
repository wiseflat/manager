import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectAlerting) {
    this.$translate = $translate;
    this.OvhApiCloudProjectAlerting = OvhApiCloudProjectAlerting;
  }

  updaetAlert() {
    return this.OvhApiCloudProjectAlerting.v6().put({
      serviceName: this.projectId,
      alertId: this.alert.id,
    }, this.alert).$promise.then(() => this.goBack(
      this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_edit_success'),
    ))
      .catch(error => this.goBack(
        this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_edit_error', { message: get(error, 'data.message') }),
        'error',
      ));
  }
}
