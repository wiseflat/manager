import { HPC } from './constants';

export const DEDICATED_CLOUD_CONFIG = {
  id: 'dedicatedClouds',
  types: [
    {
      path: '/dedicatedCloud',
      types: [
        {
          path: '/dedicatedCloud/:productId/datacenter',
          state: 'app.dedicatedClouds.datacenter',
          stateParams: ['productId', 'datacenterId'],
          app: [HPC],
        },
      ],
      state: 'app.dedicatedClouds',
      stateParams: ['productId'],
      icon: 'ovh-font ovh-font-dedicatedCloud',
      app: [HPC],
    },
  ],
  loadOnState: 'app.dedicatedClouds',
  icon: 'ovh-font ovh-font-dedicatedCloud',
  app: [HPC],
  regions: ['EU', 'CA', 'US'],
};

export const IP_CONFIG = {
  id: 'ip',
  state: 'app.ip',
  stateUrl: '#/configuration/ip?landingTo=ip',
  icon: 'ovh-font ovh-font-ip',
  app: [HPC],
  regions: ['EU', 'CA', 'US'],
};

export const DEDICATED_NETWORK_CONFIG = {
  id: 'dedicated_network',
  forceDisplaySearch: true,
  app: [HPC],
  regions: ['EU', 'CA', 'US'],
  icon: 'oui-icon oui-icon-bandwidth_concept',
  loadOnState: ['vrack', 'cloud-connect'],
  children: [
    {
      id: 'vrack',
      loadOnState: 'vrack',
      types: [
        {
          path: '/vrack',
          state: 'vrack',
          stateParams: ['vrackId'],
          app: [HPC],
        },
      ],
      icon: 'ovh-font ovh-font-vRack',
      app: [HPC],
      regions: ['EU', 'CA', 'US'],
    },
  ],
};

export const HPC_SIDEBAR_CONFIG = [
  DEDICATED_CLOUD_CONFIG,

  // CLOUD IMPORT
  DEDICATED_NETWORK_CONFIG,

  // DEDICATED END
  IP_CONFIG,
];

export default { HPC_SIDEBAR_CONFIG };
