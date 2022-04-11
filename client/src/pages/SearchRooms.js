
import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_ROOM } from '../utils/mutations';
import { saveRoomIds, getSavedRoomIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchRooms = () => {
  // create state for holding returned google api data
  const [searchedRooms, setSearchedRooms] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedRoomIds, setSavedRoomIds] = useState(getSavedRoomIds());

  const [saveRoom, {error}] = useMutation(SAVE_ROOM);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveRoomIds(savedRoomIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.refugerestrooms.org/api/v1/restrooms/search?page=1&per_page=10&offset=0&query=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const roomData = items.map((restroom) => ({
        roomId: restroom.id,
        name: restroom.name,
        street: restroom.street,
        city: restroom.city,
        state: restroom.state,
        accessible: restroom.accessible,
        unisex: restroom.unisex,
        changing_table: restroom.changing_table,
        directions: restroom.directions,
        comment: restroom.comment
      }));

      setSearchedRooms(roomData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveRoom = async (roomId) => {
    // find the book in `searchedBooks` state by the matching id
    const roomToSave = searchedRooms.find((room) => room.roomId === roomId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveRoom({
        variables: { roomData: { ...roomToSave } },
      });
      console.log(savedRoomIds);
      setSavedRoomIds([...savedRoomIds, roomToSave.roomId]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Rooms!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a room"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedRooms.length
            ? `Viewing ${searchedRooms.length} results:`
            : 'Search for a room to begin'}
        </h2>
        <CardColumns>
          {searchedRooms.map((room) => {
            return (
              <Card key={room.roomId} border="dark">
                <Card.Body>
                  <Card.Title>{room.title}</Card.Title>
                  <p className="small">Authors: {room.authors}</p>
                  <Card.Text>{room.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRoomIds?.some(
                        (savedId) => savedId === room.roomId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveRoom(room.roomId)}
                    >
                      {savedRoomIds?.some((savedId) => savedId === room.roomId)
                        ? 'Room Already Saved!'
                        : 'Save This ROom!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchRooms;