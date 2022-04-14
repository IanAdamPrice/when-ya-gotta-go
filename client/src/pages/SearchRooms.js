
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

import { Link } from 'react-router-dom'

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
        `https://www.refugerestrooms.org/api/v1/restrooms/search?query=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const items   = await response.json([]);
      console.log({items})
      console.log(searchInput)

      const roomData = items.map((bathroom) => ({
        roomId: bathroom.id,
        name: bathroom.name,
        street: bathroom.street,
        city: bathroom.city,
        state: bathroom.state,
        accessible: bathroom.accessible,
        unisex: bathroom.unisex,
        direction: bathroom.directions,
        comment: bathroom.comment,
        upvote: bathroom.upvote,
        downvote: bathroom.downvote
      }));

      console.log(roomData)
      setSearchedRooms(roomData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRoom = async (roomId) => {
    const roomToSave = searchedRooms.find((bathroom) => bathroom.roomId === roomId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveRoom({
        variables:  {roomData: { ...roomToSave }},
      });
      console.log(savedRoomIds);
      setSavedRoomIds([...savedRoomIds, roomToSave.roomId]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Jumbotron fluid className="jumbotron">
        <Container>
          <h1 className='text-center'>Find a restroom closest to you!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Enter your location!"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="danger" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container className="containers text-light">
        <h2 className='search text-center'>
          {searchedRooms.length
            ? `Here are ${searchedRooms.length} room around you!:`
            : 'Find a restroom near you!'}
        </h2>
        <Card className="bg-dark">
          {searchedRooms.map((bathroom) => {
            return (
              <Card key={bathroom.roomId} border="dark">
                <Card.Body className='classBody text-primary'>
                  <Card.Title className="title"><Link to="./SingleRoom">{bathroom.name}</Link></Card.Title>
                  <p className="small">Address: {bathroom.street}, {bathroom.city}, <br />{bathroom.state}</p>
                  <Card.Text className='body'>{bathroom.direction}<br /> {bathroom.comment}</Card.Text>
                  <h6 className='upvote'>Upvotes {bathroom.upvote}</h6>
                  <br />
                  <h6 className='downvote'>Downvotes {bathroom.downvote}</h6>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRoomIds?.some(
                        (savedId) => savedId === bathroom.roomId
                      )}
                      className="saveRoom btn-block btn-primary w-25"
                      onClick={() => handleSaveRoom(bathroom.roomId)}
                    >
                      {savedRoomIds?.some((savedId) => savedId === bathroom.roomId)
                        ? 'Room Already Saved!'
                        : 'Save This Room!'}
                    </Button>
                  )}
                                    {Auth.loggedIn() && (
                    <Button
                      className="rateRoom btn-block btn-primary w-25"
                      onClick={() => handleSaveRoom(bathroom.roomId)}
                    >
                      {savedRoomIds?.some((savedId) => savedId === bathroom.roomId)
                        ? 'Room Already Saved!'
                        : 'Rate your visit!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </Card>
      </Container>
    </div>
  );
};

export default SearchRooms;