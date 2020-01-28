import gql from 'graphql-tag';

export const FRAGEMENT_INSTANCE = gql`
  fragment InstanceFileds on Instance {
    id
    name
    location
    region
    status
    flavor {
      name
      capabilities {
        name
        enabled
      }
      vcpus
      ram
      disk
      inboundBandwidth
      outboundBandwidth
    }
    image {
      name
      distribution
      user
      type
      tags
    }
    ipAddresses {
      ip
      type
      version
      gatewayIp
      networkId
    }
    volumes {
      id
      name
      size
    }
    monthlyBilling {
      since
      status
    }
    planCode
  }
`;

export const QUERY_INSTANCES = gql`
  query instances($projectId: String) {
    instances(projectId: $projectId) {
      ...InstanceFileds
    }
    vRack(projectId: $projectId) {
      id
      name
      description
    }
  }
  ${FRAGEMENT_INSTANCE}
`;

export const QUERY_INSTANCE = gql`
  query instance($projectId: String, $instanceId: String,) {
    instance(projectId: $projectId, instanceId: $instanceId) {
      ...InstanceFileds
    }
  }
  ${FRAGEMENT_INSTANCE}
`;

export const QUERY_INSTANCE_SSH_KEY = gql`
  query instanceSshKey($projectId: String, $instanceId: String,) {
    instance(projectId: $projectId, instanceId: $instanceId) {
      id
      sshKey {
        id
        name
      }
    }
  }
`;

export const QUERY_PRIVATE_NETWORKS = gql`
  query privateNetworks($projectId: String) {
    privateNetworks(projectId: $projectId) {
      id
      name
      status
      type
    }
  }
`;

export default {
  FRAGEMENT_INSTANCE,
  QUERY_INSTANCES,
  QUERY_INSTANCE,
  QUERY_INSTANCE_SSH_KEY,
  QUERY_PRIVATE_NETWORKS,
}
