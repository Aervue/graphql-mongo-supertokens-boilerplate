const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SuperTokens = require('supertokens-node-mongo-ref-jwt/express')
const mongoose = require('mongoose')

const { typeDefs, resolvers } = require('../utils/imports')

const config = require('./config')
const requireAuthDirective = require('../auth/requireAuthDirective')

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      requireAuth: requireAuthDirective
    },
    context: ({ req, res }) => ({ req, res })
  })

  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(cookieParser())
  // app.use(authTokens)

  SuperTokens.init(config, mongoose.connection)

  app.post('/refreshtoken', function (req, res) {})

  server.applyMiddleware({
    app,
    path: '/graphql'
  })

  app.listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  )
}

module.exports = startServer
