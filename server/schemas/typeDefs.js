const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    bathroomCount: Int
    savedRooms: [Bathroom]
  }

  type Bathroom {
    roomId: Int!
    name: String
    street: String
    city: String
    state: String
    accessible: Boolean
    unisex: Boolean
    direction: String
    comment: String
  }

  input roomInput {
    roomId: Int
    name: String
    street: String
    city: String
    state: String
    accessible: Boolean
    unisex: Boolean
    direction: String
    comment: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveRoom(roomData: roomInput): User
    removeRoom(roomId: ID!): User
  }
`;

module.exports = typeDefs;