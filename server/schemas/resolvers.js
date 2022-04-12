const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')

          return userData
      }

      throw new AuthenticationError('Not logged in');
    }
  },

  Mutation: {
    addUser: async (_parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (_parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveRoom: async (_parent, { roomData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedRooms: roomData }},
          { new: true }
        );

      return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    removeRoom: async (_parent, { roomId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRooms: { roomId }}},
          { new: true }
        );

      return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;
