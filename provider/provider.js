const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const server = express()
const port = 9123 || process.env.API_PORT

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

server.get('/customer/:id', (req, res) => {
  res.json(
    {
      'firstName': 'Mary',
      'lastName': 'Jones',
      'dateJoined': '2017-01-16'
    }
  )
})

module.exports = {
  server
}
