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
      createdAt
    }
`;

export const REGION_VIEW_FIELDS = gql`\
    fragment RegionViewFields on RegionView {
      _id
      name
      capital
      leader
      path
      displayPath
      landmarks
      createdAt
      subregionCount
      previousSibling
      nextSibling
      potentialParentNames
      potentialParentIds
    }
`;