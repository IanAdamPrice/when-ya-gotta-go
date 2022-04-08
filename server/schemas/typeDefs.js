const { gql } = require('apollo-server-express');

const typeDefs = gql `
  type User {
    _id: ID!
    username: String
    email: String
    roomCount: Int
    savedRooms: [Bathroom]
  }

  type Bathroom {
    roomId: Int!
    name: String!
    street: String!
    city: String!
    state: String
    accessible: Boolean
    unisex: Boolean
    changing_table: Boolean
    directions: String
    comment: String
  }

  input roomInput {
    roomId: Int!
    name: String!
    street: String!
    city: String!
    state: String
    accessible: Boolean
    unisex: Boolean
    changing_table: Boolean
    directions: String
    comment: String
  }

  type Auth {
    me: User
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
`

module.exports = typeDefs;