import { gql } from "@apollo/client";
import { REGION_FIELDS } from "./regionFragments";

export const GET_REGIONS = gql`
    ${REGION_FIELDS}
	query GetRegions($parentId: String!, $page: Int, $perPage: Int) {
        getRegions(parentId: $parentId, page: $page, perPage: $perPage) {
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
    ${REGION_FIELDS}
    query GetRegionById($_id: String!) {
        getRegionById(_id: $_id) {
            ... on Region {
                ...RegionFields
                subregionCount
		    }
            ... on Error {
                error
            }
        }
    }
`;