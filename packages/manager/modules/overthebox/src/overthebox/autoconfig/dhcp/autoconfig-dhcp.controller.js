export default class OverTheBoxAutoconfigDhcp {
  /* @ngInject */
  constructor($q, $state, $translate, OvhApiOverTheBoxConfiguration) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiOverTheBoxConfiguration = OvhApiOverTheBoxConfiguration;
  }

  $onInit() {
    console.log('serviceName', this.serviceName);
    this.rangeStart = 100;
    this.staticLeases = [];
    return this.$q.all([this.showDhcpConfig(), this.showDhcpStaticLeases()]);
  }

  showDhcpConfig() {
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .Config()
      .v6()
      .showAllDhcpConfig({ serviceName: this.serviceName })
      .$promise.then((data) => console.log('result', data))
      .catch((error) => {
        console.log('error', error);
        this.config = [
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
        ];
      });
  }

  showDhcpStaticLeases() {
    return this.OvhApiOverTheBoxConfiguration.Dhcp()
      .StaticLease()
      .v6()
      .showAllDhcpStaticLease({ serviceName: this.serviceName })
      .$promise.then((data) => console.log('result', data));
  }

  addDhcpConfig() {
    this.$state.go('overTheBoxes.overTheBox.autoconfig.dhcpConfig');
  }

  addDhcpStaticLease() {
    this.$state.go('overTheBoxes.overTheBox.autoconfig.dhcpStaticLease');
  }
}
