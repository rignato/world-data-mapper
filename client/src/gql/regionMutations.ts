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
    mutation AddLandmark($_id: String!, $landmark: LandmarkInput!) {
      addLandmark(_id: $_id, landmark: $landmark) {
        ... on Landmark {
          _id
          name
          owner
          ownerName
        }
        ... on Error {
          error
        }
      }
    }
`;

export const DELETE_LANDMARK = gql`
    mutation DeleteLandmark($regionId: String!, $landmarkId: String!) {
      deleteLandmark(regionId: $regionId, landmarkId: $landmarkId) {
        success
        error
      }
    }
`;

export const EDIT_LANDMARK = gql`
    mutation EditLandmark($regionId: String!, $editLandmark: EditLandmarkInput!) {
      editLandmark(regionId: $regionId, editLandmark: $editLandmark) {
        success
        error
      }
    }
`;