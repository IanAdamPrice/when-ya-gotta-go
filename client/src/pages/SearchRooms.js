
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
  const [searchedRooms, setSearchedRooms] = useState([]);

  const [searchInput, setSearchInput] = useState('');

  const [savedRoomIds, setSavedRoomIds] = useState(getSavedRoomIds());

  const [saveRoom, {error}] = useMutation(SAVE_ROOM);


  useEffect(() => {
    return () => saveRoomIds(savedRoomIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.refugerestrooms.org/api/v1/restrooms/search?per_page=10&query=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const items  = await response.json();
      console.log(items)
      console.log(searchInput)

      const roomData = items.map((room) => ({
        roomId: room.id,
        name: room.name,
        street: room.street,
        city: room.city,
        state: room.state,
        accessible: room.accessible,
        unisex: room.unisex,
        direction: room.directions,
        comment: room.comment,
        latitude: room.latitude,
        longitude: room.longitude
      }));

      console.log(roomData)
      setSearchedRooms(roomData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRoom = async (roomId) => {
    const roomToSave = searchedRooms.find((room) => room.roomId === roomId);

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
      <Jumbotron fluid className="jumbotron">
        <Container>
          <h1 className='text-center'>Find a restroom closest to you!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={12}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a room"
                />
              </Col>
              <Col xs={12} md={12}>
                <Button type="submit" variant="danger" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container className="container text-light">
        <h2 className='text-center'>
          {searchedRooms.length
            ? `Here are ${searchedRooms.length} room around you!:`
            : 'Search for a room to begin'}
        </h2>
        <CardColumns className="bg-dark">
          {searchedRooms.map((room) => {
            return (
              <Card key={room.roomId} border="dark">
                <Card.Body className='text-primary'>
                  <Card.Title>{room.name}</Card.Title>
                  <p className="small">Address: {room.street}</p>
                  <Card.Text>{room.city}</Card.Text>
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
                        : 'Save This Room!'}
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