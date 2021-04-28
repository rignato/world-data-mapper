import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetUser {
        getUser {
            ... on User {
		    	name
		    	email
		    }
            ... on UserError {
                message
            }
        }
		
	}
`;