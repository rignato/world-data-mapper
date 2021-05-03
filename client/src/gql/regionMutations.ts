import { gql } from '@apollo/client';

export const ADD_REGION = gql`
    mutation AddRegion($parentId: String!) {
      addRegion(parentId: $parentId) {
        success
        error
      }
    }
`;