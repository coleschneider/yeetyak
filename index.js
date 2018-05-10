const express = require('express')
const path = require("path")
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config.js')
const mongoose = require("mongoose")
const webpackCompiler = webpack(config)
const app = express()
const server = require("http").createServer(app)
const io = socketIo(server)

// app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use((webpackDevMiddleware)(webpackCompiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use((webpackHotMiddleware)(webpackCompiler, {
  log: console.log,
  publicPath: config.output.publicPath,
  hot: true,
  heartbeat: 10 * 1000
}))

// app.use(express.static(path.join(__dirname, 'dist')))

mongoose.connect('mongodb://localhost/yeetyak', {
  useMongoClient: true
})

var db = mongoose.connection

db.on('error', () => {
  console.log('failed')
})

db.once('open', () => {
  console.log('connected to mongoose')
})

mongoose.Promise = global.Promise
const MessageSchema = mongoose.Schema({
    body: {type: String},
    from: {type: String},
}, {timestamps: true})




io.on('connection', socket => {
  socket.on('message', body => {
    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(8)
    })
  })
})


server.listen(3000)