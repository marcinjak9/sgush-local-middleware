require('dotenv').config()
console.log(process.env)
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
const port = process.env.PORT | 3001
const baseURL = process.env.BASE_URL

app.use(cors())
app.use(bodyParser.json())

const instance = axios.create({
  baseURL: baseURL,
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
  console.log(`Sgush middleware listening on http://localhost:${port}`)
})
