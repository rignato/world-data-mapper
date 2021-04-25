import { gql } from 'apollo-server';

export const userDefs = gql`
    type User {
        _id: String!
        name: String!
        email: String!
    }

    type Query {
        getUser: User
    }

    type Mutation {
        login(email: String!, password: String!): User
        logout: Boolean!
        register(name: String!, email: String!, password: String!): Boolean!
    }
`;