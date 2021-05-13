import { gql } from '@apollo/client';

export const REGION_FIELDS = gql`\
    fragment RegionFields on Region {
      _id
      name
      capital
      leader
      path
      displayPath
      landmarks
    }
`;