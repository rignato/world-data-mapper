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
        }
	}
`;

export const GET_REGION_BY_ID = gql`
    ${REGION_VIEW_FIELDS}
    query GetRegionById($_id: String!) {
        getRegionById(_id: $_id) {
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