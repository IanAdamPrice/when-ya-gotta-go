import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  } 
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_ROOM = gql`
  mutation saveRoom($roomData: roomInput!) {
    saveRoom(roomData: $roomData) {
      _id
      username
      email
      savedRooms {
        roomId: Int
        name: String
        street: String
        city: String
        state: String
        accessible: Boolean
        unisex: Boolean
        changing_table: Boolean
        directions: String
        comment: String
      }
    }
  }
`;

export const REMOVE_ROOM = gql`
  mutation removeRoom($roomId: ID!) {
    removeRoom(roomId: $roomId) {
      _id
      username
      email
      savedRooms {
        roomId: Int
        name: String
        street: String
        city: String
        state: String
        accessible: Boolean
        unisex: Boolean
        changing_table: Boolean
        directions: String
        comment: String
      }
    }
  }
`;