export default class AutoconfigDhcpConfigCtrl {
  /* @ngInject */
  constructor($translate, OvhApiOverTheBoxConfiguration) {
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.errorMessage = '';
    this.priority = 1;
  }

  createDhcpConfig() {
    this.errorMessage = '';
    this.isLoading = true;
    const params = {
      leaseDuration: this.leaseDuration,
      offset: this.offset,
      poolSize: this.poolSize,
      priority: this.priority,
    };
    if (this.interface) {
      params.interface = this.interface;
    }

    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .createDhcpConfig(
        {
          serviceName: this.serviceName,
        },
        {
          params,
        },
      )
      .$promise.then(() => {
        this.goBack();
      })
      .catch((error) => {
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_create_error',
          { errorMessage: error.data.message },
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
