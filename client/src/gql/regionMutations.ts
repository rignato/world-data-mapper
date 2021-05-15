import { gql } from '@apollo/client';
import { REGION_FIELDS } from './regionFragments';

export const ADD_REGION = gql`
    ${REGION_FIELDS}
    mutation AddRegion($parentId: String!, $region: RegionInput) {
      addRegion(parentId: $parentId, region: $region) {
        ... on Region {
          ...RegionFields
        }
        ... on Error {
          error
        }
      }
    }
`;

export const DELETE_REGION = gql`
    mutation DeleteRegion($_id: String!) {
      deleteRegion(_id: $_id) {
        success
        error
      }
    }
`;

export const EDIT_REGION = gql`
    mutation EditRegion($regionToEdit: EditRegionInput!) {
      editRegion(regionToEdit: $regionToEdit) {
        success
        error
      }
    }
`;

export const CHANGE_PARENT = gql`
    mutation ChangeParent($_id: String!, $parentId: String!) {
      changeParent(_id: $_id, parentId: $parentId) {
        success
        error
      }
    }
`;

export const ADD_LANDMARK = gql`
    mutation AddLandmark($_id: String!, $landmark: String!) {
      addLandmark(_id: $_id, landmark: $landmark) {
        success
        error
      }
    }
`;