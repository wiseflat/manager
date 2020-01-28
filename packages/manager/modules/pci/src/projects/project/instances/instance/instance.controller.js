import includes from 'lodash/includes';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

export default class PciInstanceController {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    CucCloudMessage,
    CucRegionService,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.loadingPrivateNetworks = false;
    this.loadMessages();
    this.getPrivateNetworks(this.projectId, this.instance);
    this.getReverseIp(this.instance);
    this.getGrapgQlInstanceSshKey(this.projectId, this.instance.id);
    this.getInstancePrice(this.projectId, this.instance);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.instances.instance',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getPrivateNetworks(projectId, instance) {
    this.loadingPrivateNetworks = true;
    this.PciProjectsProjectInstanceService.getGrapgQlPrivateNetworks(projectId)
      .then(privateNetworks => {
        this.privateNetworks = filter(privateNetworks, (privateNetwork) =>
          includes(
            map(
              filter(instance.ipAddresses, { type: 'private' }),
              'networkId',
            ),
            privateNetwork.id,
          ),
        );
      })
      .finally(() => this.loadingPrivateNetworks = false);
  }

  getReverseIp(instance) {
    const ip = get(find(instance.ipAddresses, { type: 'public', version: 4 }), 'ip');
    if (!ip) {
      return null;
    }
    this.loadingReverseIp = true;
    this.PciProjectsProjectInstanceService.getReverseIp(instance)
      .then(ip => {
        this.ipReverse = ip;
      })
      .finally(() => this.loadingReverseIp = false);
  }

  getGrapgQlInstanceSshKey(projectId, instanceId) {
    this.loadingSshKey = true;
    this.PciProjectsProjectInstanceService.getGrapgQlInstanceSshKey(projectId, instanceId)
      .then(sshKey => {
        this.sshKey = sshKey;
      })
      .finally(() => this.loadingSshKey = false);
  }

  getInstancePrice(projectId, instance) {
    this.loadingPrice = true;
    this.PciProjectsProjectInstanceService.getInstancePrice(projectId, instance)
      .then(price => {
        this.instancePrice = price;
      })
      .finally(() => this.loadingPrice = false);
  }
}
