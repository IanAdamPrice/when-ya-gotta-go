const { gql } = require('apollo-server-express');


const typeDefs = gql`
  scalar decimal
  
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
    upvote: Int
    downvote: Int
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
    upvote: Int
    downvote: Int
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