import { gql } from "@apollo/client";

export const GET_MAPS = gql`
	query GetMaps($page: Int, $perPage: Int) {
    getMaps(page: $page, perPage: $perPage) {
        maps {
          _id
          name
        }
        error
        totalPageCount
    }
	}
`;