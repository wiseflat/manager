export default class AutoconfigDhcpStaticLeaseCtrl {
  /* @ngInject */
  constructor($translate, OvhApiOverTheBoxConfiguration) {
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.errorMessage = '';
    this.priority = 1;
  }

  createDhcpStaticLease() {
    this.errorMessage = '';
    this.isLoading = true;
    const params = {
      hostname: this.hostname,
      ip: this.ip,
      mac: this.mac,
      priority: this.priority,
    };

    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .StaticLease()
      .v6()
      .createDhcpStaticLease(
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
