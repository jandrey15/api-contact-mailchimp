const express = require('express')
const Mailchimp = require('mailchimp-api-v3')
const cors = require('cors')
const app = express()
const { config } = require('./config')

app.use(
  cors({
    origin: ['https://johnserrano.co', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  })
)

const port = process.env.PORT || 3000

const listId = config.listId || '12345'
const apiKey = config.apiKeyMail || '12345'
// const dc = apiKey.split('-')[1]
const mailchimp = new Mailchimp(apiKey)

app.use(express.json())

app.get('/get', (req, res, next) => {
  res.json({
    version: process.env.VERSION
  })
})

app.post('/post', function (request, response) {
  response.send(request.body)
})

app.post('/api/contact', (req, res) => {
  mailchimp
    .post(`/lists/${listId}/members`, {
      email_address: req.body.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: req.body.firstName,
        LNAME: ''
      }
    })
    .then(function (results) {
      if (results.statusCode < 300) {
        res.status(200).send({ message: 'Gracias por subscribirse.', status: 200 })
      } else {
        res.status(400).send({
          message: 'Algo salio mal intentalo mas tarde.',
          status: 400
        })
      }
    })
    .catch(function (err) {
      if (err.status === 400) {
        res.status(400).send({
          message: 'El Correo electrónico ya existe.',
          status: 400
        })
      } else {
        res.status(500).send({ message: 'Algo salio mal :(', status: 500 })
      }
    })
})

app.listen(port, err => {
  if (err) throw err
  console.log(`> Ready On Server http://localhost:${port}`)
})
