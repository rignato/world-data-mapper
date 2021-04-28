import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login($email: String!, $password: String!) {
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

export const LOGOUT = gql`
    mutation Logout {
        logout {
            success
            message
        }
    }
`;

export const REGISTER = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
            success
            message
        }
    }
`;

export const UPDATE = gql`
    mutation Update($name: String!, $email: String!, $password: String!) {
        update(name: $name, email: $email, password: $password) {
            success
            message
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
        update(old_password: $oldPassword, newPassword: $newPassword) {
            success
            message
        }
    }
`;