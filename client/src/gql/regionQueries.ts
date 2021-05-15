import { gql } from "@apollo/client";
import { REGION_FIELDS, REGION_VIEW_FIELDS } from "./regionFragments";

export const GET_REGIONS = gql`
    ${REGION_FIELDS}
	query GetRegions($parentId: String!, $page: Int, $perPage: Int, $sortBy: String, $reversed: Boolean) {
        getRegions(parentId: $parentId, page: $page, perPage: $perPage, sortBy: $sortBy, reversed: $reversed) {
            regions {
              ...RegionFields
            }
            error
            totalPageCount
            displayPath
            path
        }
	}
`;

export const GET_REGION_BY_ID = gql`
    ${REGION_VIEW_FIELDS}
    query GetRegionById($_id: String!, $sortBy: String, $reversed: Boolean) {
        getRegionById(_id: $_id, sortBy: $sortBy, reversed: $reversed) {
            ... on RegionView {
                ...RegionViewFields
                subregionCount
		    }
            ... on Error {
                error
            }
        }
    }
`;

export const GET_REGION_PATH = gql`
    query GetRegionPath($_id: String!) {
        getRegionPath(_id: $_id) {
            ... on RegionPath {
                _id
                name
                path
                displayPath
		    }
            ... on Error {
                error
            }
        }
    }
`;

export const GET_LANDMARKS = gql`
    query GetLandmarks($_id: String!, $perPage: Int, $page: Int) {
        getLandmarks(_id: $_id, perPage: $perPage, page: $page) {
            landmarks {
              name
              owner
            }
            error
            totalPageCount
        }
    }
`;