import gql from 'graphql-tag';

export const CREATE_INSTANCE = gql`
  mutation createInstance(
    $projectId: String
    $instanceData: createInstanceInput
  ) {
    createInstance(projectId: $projectId, instanceData: $instanceData) {
      id
    }
  }
`;

export const DELETE_INSTANCE = gql`
  mutation deleteInstance($projectId: String, $instanceId: String) {
    deleteInstance(projectId: $projectId, instanceId: $instanceId)
  }
`;

export const UPDATE_INSTANCE = gql`
  mutation updateInstance(
    $projectId: String
    $instanceId: String
    $instanceName: String
  ) {
    updateInstance(
      projectId: $projectId
      instanceId: $instanceId
      instanceName: $instanceName
    )
  }
`;

export default {
  DELETE_INSTANCE,
  UPDATE_INSTANCE,
};
