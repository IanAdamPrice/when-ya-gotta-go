const { Schema } = require('mongoose');

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
