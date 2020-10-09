export default class OverTheBoxAutoconfigDns {
  /* @ngInject */
  constructor($q, $translate, OvhApiOverTheBoxConfiguration) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    this.showAddServer = false;
    this.showAddLocalDomain = false;

    this.nameserver = {
      server: '',
      priority: '',
    };

    this.localDomain = {
      hostname: '',
      ip: '',
      priority: '',
    };

    console.log('serviceName', this.serviceName);

    return this.$q.all([this.loadLocalDomain(), this.loadNameserver()]);
  }

  loadLocalDomain() {
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .LocalDomain()
      .v6()
      .showAllLocalDomain({ serviceName: this.serviceName })
      .$promise.then((data) => console.log('result', data))
      .catch((error) => {
        console.log('error', error);
        this.localDomains = [
          {
            id: 'dc0d29a4-6428-4980-bdd6-6157d8e3c26c',
            data: {
              hostname: 'asd',
              ip: '1.2.3.4',
            },
            priority: 2,
          },
        ];
      });
  }

  loadNameserver() {
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .Nameserver()
      .v6()
      .showAllNameserver({ serviceName: this.serviceName })
      .$promise.then((data) => console.log('result', data))
      .catch((error) => {
        console.log('error', error);
        this.nameServers = [
          {
            id: '65ee2806-1adf-4308-a0a1-45e4051cce4f',
            data: {
              server: '1.2.3.4',
            },
            priority: 1,
          },
          {
            id: '754d2a40-93d6-45d7-83c7-c85f911a1e25',
            data: {
              server: '1.2.1.2',
            },
            priority: 2,
          },
          {
            id: 'c2613f4d-4e76-4fcf-97a3-8cbdc5201d7f',
            data: {
              server: '1.2.3.4',
            },
            priority: 13,
          },
          {
            id: 'a2b7dd3d-f411-448f-a4b3-c20d7c15f862',
            data: {
              server: '1.2.1.2',
            },
            priority: 23,
          },
          {
            id: 'ba8c0774-fa9e-43f7-8233-62dfe252b41e',
            data: {
              server: '1.2.1.2',
            },
            priority: 123,
          },
          {
            id: '819af4af-a0df-40d7-8b31-0b37063707a9',
            data: {
              server: '1.2.3.4',
            },
            priority: 131,
          },
          {
            id: '01c197df-1416-4ecc-b648-c21a5ea665dc',
            data: {
              server: '1.2.1.2',
            },
            priority: 1231,
          },
          {
            id: 'b573766d-ac45-40a9-baa0-89320de32750',
            data: {
              server: '1.2.3.2',
            },
            priority: 1311,
          },
          {
            id: 'e9aebb50-a168-46ad-8702-e8b655cf4ac0',
            data: {
              server: '1.2.3.4',
            },
            priority: 1312,
          },
          {
            id: 'ebc83501-5e18-48ff-9f2b-71dde0ec0968',
            data: {
              server: '1.2.1.2',
            },
            priority: 12311,
          },
          {
            id: '47107791-8541-477d-99de-27a60b3a0394',
            data: {
              server: '1.2.3.2',
            },
            priority: 13121,
          },
        ];
      });
  }

  addNameserver() {
    this.nameserver.server = '';
    this.nameserver.priority = '';
    this.showAddServer = true;
  }

  createNameServer() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.nameserver.server && !this.nameserver.priority) {
      return null;
    }

    return this.OvhApiOverTheBoxConfiguration.Dns()
      .Nameserver()
      .v6()
      .createNameserver(
        { serviceName: this.serviceName },
        { server: this.nameserver.server, priority: this.nameserver.priority },
      )
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_server_create_succeed',
        );

        // Reload nameserver table
        this.loadNameserver();
        this.showAddServer = false;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_create_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  cancelCreateNameServer() {
    this.showAddServer = false;
  }

  removeNameserver(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .Nameserver()
      .v6()
      .removeNameserver({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_server_remove_succeed',
        );

        // Reload nameserver table
        this.loadNameserver();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_remove_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  addLocalDomain() {
    this.localDomain.hostname = '';
    this.localDomain.ip = '';
    this.localDomain.priority = '';
    this.showAddLocalDomain = true;
  }

  createLocalDomain() {
    this.errorMessage = '';
    this.successMessage = '';
    if (
      !this.localDomain.hostname &&
      !this.localDomain.ip &&
      !this.localDomain.priority
    ) {
      return null;
    }

    return this.OvhApiOverTheBoxConfiguration.Dns()
      .LocalDomain()
      .v6()
      .createLocalDomain(
        { serviceName: this.serviceName },
        {
          hostname: this.localDomain.hostname,
          ip: this.localDomain.ip,
          priority: this.localDomain.priority,
        },
      )
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_local_domain_create_succeed',
        );

        // Reload local domain table
        this.loadLocalDomain();
        this.showAddLocalDomain = false;
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_create_failed',
          { errorMessage: error.data.message },
        );
      });
  }

  cancelCreateLocalDomain() {
    this.showAddLocalDomain = false;
  }

  onLocalDomainDelete(row) {
    this.errorMessage = '';
    this.successMessage = '';
    return this.OvhApiOverTheBoxConfiguration.Dns()
      .LocalDomain()
      .v6()
      .removeLocalDomain({ serviceName: this.serviceName, id: row.id })
      .$promise.then((data) => {
        // Display success message
        this.successMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_local_domain_remove_succeed',
        );

        // Reload local domain table
        this.loadLocalDomain();
        return data;
      })
      .catch((error) => {
        // Display error message
        this.errorMessage = this.$translate.instant(
          'overTheBox_autoconfig_dns_failed',
          { errorMessage: error.data.message },
        );
      });
  }
}
