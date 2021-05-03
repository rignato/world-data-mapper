import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
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

export const LOGOUT = gql`
    mutation Logout {
        logout {
            success
            error
        }
    }
`;

export const REGISTER = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
            success
            error
        }
    }
`;

export const UPDATE = gql`
    mutation Update($name: String!, $email: String!, $password: String!) {
        update(name: $name, email: $email, password: $password) {
            success
            error
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
        updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
            success
            error
        }
    }
`;