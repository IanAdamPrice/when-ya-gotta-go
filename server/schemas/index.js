const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
import { makeExecutableSchema } from 'graphql-tools';


export default makeExecutableSchema({ typeDefs, resolvers });
