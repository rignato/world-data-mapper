import { gql } from "@apollo/client";

export const GET_ALL_MAPS = gql`
	query GetAllMaps {
    getAllMaps {
        maps {
          _id
          name
        }
        error
    }
        
	}
`;