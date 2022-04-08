import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
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