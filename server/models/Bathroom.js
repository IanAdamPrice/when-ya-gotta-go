const { Schema } = require('mongoose');

const bathroomSchema = new Schema({
  roomId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
  },
  street: {
    type: String,
  },
  city: {
    type: String,
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
  direction: {
    type: String,
  },
  comment: {
    type: String,
  },
  upvote: {
    type: Number
  },
  downvote: {
    type: Number
  }
});

module.exports = bathroomSchema;
