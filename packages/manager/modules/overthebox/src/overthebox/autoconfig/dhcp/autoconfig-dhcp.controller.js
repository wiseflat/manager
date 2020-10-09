export default class OverTheBoxAutoconfigDhcp {
  /* @ngInject */
  constructor($q, $state, $translate, OvhApiOverTheBoxConfiguration) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.showAddConfig = false;
    this.showAddStaticLease = false;

    this.config = {
      interface: '',
      leaseDuration: '',
      offset: '',
      poolSize: '',
      priority: '',
    };

    this.staticLease = {
      hostname: '',
      ip: '',
      mac: '',
      priority: '',
    };

    return this.$q.all([this.loadConfig(), this.loadStaticLeases()]);
  }

  loadConfig() {
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .showAllConfig({
        serviceName: this.serviceName,
      })
      .$promise.then((data) => {
        this.configList = data.result;
        return data;
      })
      .catch((error) => {
        console.log('error', error);
        this.configList = [
          {
            id: 'f0151a8d-04ef-43d3-b367-628e8b5e7182',
            data: {
              interface: 'test',
              offset: 2,
              poolSize: 59,
              leaseDuration: 123,
            },
            priority: 1,
          },
          {
            id: '7cfbd450-c40b-48b9-bcaa-a7d9deac9bf4',
            data: {
              interface: 'lan',
              offset: 22,
              poolSize: 22,
              leaseDuration: 3600,
            },
            priority: 5,
          },
        ];
      });
  }

  addConfig() {
    this.config.interface = '';
    this.config.leaseDuration = '';
    this.config.offset = '';
    this.config.poolSize = '';
    this.config.priority = '';
    this.showAddConfig = true;
  }

  createConfig() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.config.leaseDuration &&
      !this.config.offset &&
      !this.config.poolSize &&
      !this.config.priority
    ) {
      return null;
    }

    const params = {
      leaseDuration: this.config.leaseDuration,
      offset: this.config.offset,
      poolSize: this.config.poolSize,
      priority: this.config.priority,
    };

    if (this.config.interface) {
      params.interface = this.config.interface;
    }

    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .createConfig(
        {
          serviceName: this.serviceName,
        },
        {
          params,
        },
      )
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_config_create_succeed',
        );

        // Reload config table
        this.loadConfig();
        this.showAddConfig = false;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_create_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  cancelCreateConfig() {
    this.showAddConfig = false;
  }

  removeConfig(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .removeConfig({
        serviceName: this.serviceName,
        id: row.id,
      })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_config_remove_succeed',
        );

        // Reload config table
        this.loadConfig();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_remove_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  loadStaticLeases() {
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .StaticLease()
      .v6()
      .showAllStaticLease({
        serviceName: this.serviceName,
      })
      .$promise.then((data) => {
        console.log('result', data);
        this.staticLeases = data.result;
        return data;
      })
      .catch((error) => {
        // Display error message
        console.log('error', error);
        this.staticLeases = [];
      });
  }

  addStaticLease() {
    this.staticLease.hostname = '';
    this.staticLease.ip = '';
    this.staticLease.mac = '';
    this.staticLease.priority = '';
    this.showAddStaticLease = true;
  }

  createStaticLease() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.staticLease.hostname &&
      !this.staticLease.ip &&
      !this.staticLease.mac &&
      !this.config.priority
    ) {
      return null;
    }

    const params = {
      hostname: this.staticLease.hostname,
      ip: this.staticLease.ip,
      mac: this.staticLease.mac,
      priority: this.staticLease.priority,
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
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_static_lease_create_succeed',
        );

        // Reload static lease table
        this.loadStaticLeases();
        this.showAddStaticLease = false;
        return data;
      })
      .catch((error) => {
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_create_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }

  cancelCreateStaticLease() {
    this.showAddStaticLease = false;
  }

  removeStaticLease(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .StaticLease()
      .v6()
      .removeStaticLease({
        serviceName: this.serviceName,
        id: row.id,
      })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_static_lease_remove_succeed',
        );

        // Reload static lease table
        this.loadStaticLeases();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dhcp_remove_failed',
          {
            errorMessage: error.data.message,
          },
        );
      });
  }
}
