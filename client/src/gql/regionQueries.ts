import { gql } from "@apollo/client";

export const GET_REGIONS = gql`
	query GetRegions($parentId: String!, $page: Int, $perPage: Int) {
        getRegions(parentId: $parentId, page: $page, perPage: $perPage) {
            regions {
              _id
              name
              leader
              capital
              landmarks
            }
            error
            totalPageCount
            displayPath
        }
	}
`;

export const GET_REGION_BY_ID = gql`
    query GetRegionById($_id: String!) {
        getRegionById(_id: $_id) {
            ... on Region {
                _id
                name
                capital
                leader
                landmarks
                path
                displayPath
                subregionCount
		    }
            ... on Error {
                error
            }
        }
    }
`;