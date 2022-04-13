import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_ROOM } from '../utils/mutations';
import { removeRoomId } from '../utils/localStorage';
import Auth from '../utils/auth';

const SavedRooms = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeRoom, { error }] = useMutation(REMOVE_ROOM);

  const userData = data?.me || {};

  // create function that accepts the room's _id value as param and deletes the room from the database
  const handleDeleteRoom = async (roomId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeRoom({
        variables: { roomId },
      });

      // upon success, remove room's id from localStorage
      removeRoomId(roomId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing {userData.username}'s rooms!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedRooms?.length
            ? `Viewing ${userData.savedRooms.length} saved ${
                userData.savedRooms.length === 1 ? 'room' : 'rooms'
              }:`
            : 'You have no saved rooms!'}
        </h2>
        <CardColumns>
          {userData.savedRooms?.map((bathroom) => {
            return (
              <Card key={bathroom.roomId} border='dark'>
                <Card.Body className='text-primary'>
                  <Card.Title>{bathroom.name}</Card.Title>
                  <p className='small'>Adress: {bathroom.street}</p>
                  <Card.Text>{bathroom.city}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteRoom(bathroom.roomId)}>
                    Delete this room!
                  </Button>
                  {error && <span className="ml-2">Something went wrong...</span>}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedRooms;