import get from 'lodash/get';

import Consumption from '../../../../../components/project/billing/consumption/consumption.service';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.Consumption = Consumption;
  }

  static getNextMonth() {
    return moment().add(1, 'month').format('MMMM');
  }

  static getCurrentMonth() {
    return moment().format('MMMM');
  }

  getTotalForecast() {
    return get(this.hourlyForecast, 'price.value', 0) + get(this.monthlyForecast, 'prices.withTax.value', 0);
  }

  getConsumptionChart() {
    const currencyCode = this.user.currency.symbol;
    return {
      estimate: {
        now: {
          value: get(this.consumption, 'price.value', 0),
          currencyCode,
          label: this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_now'),
        },
        endOfMonth: {
          value: get(this.hourlyForecast, 'price.value', 0),
          currencyCode,
          label: this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_future'),
        },
      },
      threshold: {
        now: {
          value: this.alert.monthlyThreshold,
          currencyCode,
          label: this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_limit'),
        },
        endOfMonth: {
          value: this.forecast.alert.monthlyThreshold,
          currencyCode,
          label: this.$translate.instant('pci_projects_project_billing_forecast_forecast_alert_limit'),
        },
      },
    };
  }
}
