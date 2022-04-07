const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const bathroomSchema = new Schema({
  roomId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  accessible: {
    type: Boolean,
  },
  unisex: {
    type: Boolean,
  },
  changing_table: {
    type: Boolean,
  },
  directions: {
    type: String,
  },
  comment: {
    type: String,
  }
});

module.exports = bathroomSchema;
