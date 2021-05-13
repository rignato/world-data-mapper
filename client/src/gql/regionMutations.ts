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