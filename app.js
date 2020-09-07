const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())

const instance = axios.create({
  baseURL: 'https://1t8el77y9k.execute-api.eu-west-2.amazonaws.com',
  timeout: 100000,
});

app.use('*', (req, res) => {
  if (!req.headers.authorization || ! req.headers['x-api-key']) {
    return res.status(403).send('Unauthorized')
  }

  instance.request({
    method: req.method,
    url: req.originalUrl,
    headers: {
      Authorization: req.headers.authorization,
      'X-Api-Key': req.headers['x-api-key'],
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    data: req.body
  })
    .then((response) => {
      res.status(response.status).send(response.data)
    })
    .catch((error) => {
      res.status(error.response.status).send(error.response.statusText)
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
