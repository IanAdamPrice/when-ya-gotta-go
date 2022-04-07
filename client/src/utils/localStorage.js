export const getSavedRoomIds = () => {
  const savedRoomIds = localStorage.getItem('saved_rooms')
    ? JSON.parse(localStorage.getItem('saved_rooms'))
    : [];

  return savedRoomIds;
};

export const saveRoomIds = (roomIdArr) => {
  if (roomIdArr.length) {
    localStorage.setItem('saved_rooms', JSON.stringify(roomIdArr));
  } else {
    localStorage.removeItem('saved_rooms');
  }
};

export const removeRoomId = (bookId) => {
  const savedRoomIds = localStorage.getItem('saved_rooms')
    ? JSON.parse(localStorage.getItem('saved_rooms'))
    : null;

  if (!savedRoomIds) {
    return false;
  }

  const updatedSavedRoomIds = savedRoomIds?.filter((savedRoomId) => savedRoomId !== roomId);
  localStorage.setItem('saved_room', JSON.stringify(updatedSavedRoomIds));

  return true;
};
