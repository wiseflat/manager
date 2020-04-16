import get from 'lodash/get';
import head from 'lodash/head';

import {
  DEDICATED_IPS_URL,
  FIREWALL_URL,
  MITIGATION_URL,
} from './instance.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance', {
    url: '/:instanceId',
    component: 'pciProjectsProjectInstancesInstance',
    resolve: {
      instanceId: /* @ngInject */ ($transition$) => {
        try {
          const id = $transition$.params().instanceId;
          console.log('id', id);
          return id;
        } catch (err) {
          console.log('instanceIderror: ', err);
          return 0;
        }
      },
      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => {
        try {
          return PciProjectsProjectInstanceService.get(projectId, instanceId)
            .then((instance) => {
              console.log('instance', instance);
              return instance;
            })
            .catch((e) => {
              console.log('instancePromiseerror', e);
              throw e;
            });
        } catch (err) {
          console.log('instanceerror: ', err);
          return 0;
        }
      },

      instancePrice: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instance,
      ) => {
        try {
          return PciProjectsProjectInstanceService.getInstancePrice(
            projectId,
            instance,
          )
            .then((instancePrice) => {
              console.log('instancePrice', instancePrice);
              return instancePrice;
            })
            .catch((e) => {
              console.log('instancePricePromiseerror', e);
              throw e;
            });
        } catch (err) {
          console.log('instancePriceerror: ', err);
          return 0;
        }
      },

      reverseDnsLink: /* @ngInject */ (coreConfig) => {
        try {
          const reverseDnsLink = DEDICATED_IPS_URL[coreConfig.getRegion()];
          console.log('reverseDnsLink', reverseDnsLink);
          return reverseDnsLink;
        } catch (err) {
          console.log('reverseDnsLinkerror: ', err);
          return 0;
        }
      },

      ipMitigationLink: /* @ngInject */ (coreConfig, instance) => {
        try {
          const ipMitigationLink = MITIGATION_URL(
            get(head(instance.publicIpV4), 'ip'),
            coreConfig.getRegion(),
          );
          console.log('ipMitigationLink', ipMitigationLink);
          return ipMitigationLink;
        } catch (err) {
          console.log('ipMitigationLinkerror: ', err);
          return 0;
        }
      },

      firewallLink: /* @ngInject */ (coreConfig, instance) => {
        try {
          const firewallLink = FIREWALL_URL(
            get(head(instance.publicIpV4), 'ip'),
            coreConfig.getRegion(),
          );
          console.log('firewallLink', firewallLink);
          return firewallLink;
        } catch (err) {
          console.log('firewallLinkerror: ', err);
          return 0;
        }
      },

      breadcrumb: /* @ngInject */ (instance) => instance.name,

      instanceLink: /* @ngInject */ ($state, instance, projectId) => {
        try {
          const instanceLink = $state.href(
            'pci.projects.project.instances.instance',
            {
              projectId,
              instanceId: instance.id,
            },
          );
          console.log('instanceLink', instanceLink);
          return instanceLink;
        } catch (err) {
          console.log('instanceLinkerror: ', err);
          return 0;
        }
      },
      consoleLink: /* @ngInject */ ($state, instance, projectId) => {
        try {
          const consoleLink = $state.href(
            'pci.projects.project.instances.instance.vnc',
            {
              projectId,
              instanceId: instance.id,
            },
          );
          console.log('consoleLink', consoleLink);
          return consoleLink;
        } catch (err) {
          console.log('consoleLinkerror: ', err);
          return 0;
        }
      },
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () => {
        try {
          const currentActiveLink = $state.href(
            $state.current.name,
            $transition$.params(),
          );
          console.log('currentActiveLink', currentActiveLink);
          return currentActiveLink;
        } catch (err) {
          console.log('currentActiveLinkerror: ', err);
          return 0;
        }
      },
      editInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.edit', {
          projectId,
          instanceId: instance.id,
        }),
      enableMonthlyBillingInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go(
          'pci.projects.project.instances.instance.active-monthly-billing',
          {
            projectId,
            instanceId: instance.id,
          },
        ),
      createBackupInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go('pci.projects.project.instances.instance.backup', {
          projectId,
          instanceId: instance.id,
        }),
      startRescueInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go('pci.projects.project.instances.instance.rescue', {
          projectId,
          instanceId: instance.id,
        }),
      endRescueInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.unrescue', {
          projectId,
          instanceId: instance.id,
        }),
      softRebootInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.soft-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      hardRebootInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.hard-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      reinstallInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.reinstall', {
          projectId,
          instanceId: instance.id,
        }),
      resumeInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.resume', {
          projectId,
          instanceId: instance.id,
        }),
      deleteInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.delete', {
          projectId,
          instanceId: instance.id,
        }),
      applicationAccess: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go(
          'pci.projects.project.instances.instance.application-access',
          {
            projectId,
            instanceId: instance.id,
          },
        ),
      goToBlockStorages: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.blocks', {
          projectId,
        }),
      attachVolume: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.attachVolume', {
          projectId,
          instanceId: instance.id,
        }),
      gotToNetworks: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.privateNetwork', {
          projectId,
        }),
      attachPrivateNetwork: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go(
          'pci.projects.project.instances.instance.attachPrivateNetwork',
          {
            projectId,
            instanceId: instance.id,
          },
        ),
      goToInstance: /* @ngInject */ (
        $rootScope,
        CucCloudMessage,
        $state,
        instanceId,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.instances.instance',
          {
            projectId,
            instanceId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.instances.instance',
            ),
          );
        }

        return promise;
      },
    },
  });
};
