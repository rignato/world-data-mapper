import { gql } from "@apollo/client";

export const ADD_MAP = gql`
    mutation AddMap {
        addMap {
            success
            error
        }
    }
`;

export const DELETE_MAP = gql`
    mutation DeleteMap($_id: String!) {
        deleteMap(_id: $_id) {
            success
            error
        }
    }
`;

export const RENAME_MAP = gql`
    mutation RenameMap($_id: String!, $name: String!) {
        renameMap(_id: $_id, name: $name) {
            success
            error
        }
    }
`;