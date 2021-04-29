import { gql } from "@apollo/client";

export const GET_USER = gql`
	query GetUser {
        getUser {
            ... on User {
		    	name
		    	email
		    }
            ... on Error {
                error
            }
        }
		
	}
`;