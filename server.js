// @flow

const express = require('express')
const config = require('./config')
const port = process.env.PORT || config.port

const app = express()

app.use(express.static('./public'))

app.listen(port, ()=> console.log(`listening to port: ${port}`))
