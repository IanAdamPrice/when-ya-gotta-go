import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedRooms {
        roomId
        name
        street
        city
        state
        accessible
        unisex
        direction
        comment
      }
    }
  }
`;