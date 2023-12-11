const app = require('./app.js')
const cors = require("cors")
const route = require('./routes')
const bodyParser = require("body-parser")
const db = require("./config/db/DbConnection")
require('dotenv').config()
const http = require('http')
const socket = require('./io')
const { urlui } = require('./utils/api')

// Kết nối database
// //var indexRouter = require("./routers/index");
// var bookRouter = require("./routers/book");

// //app.use('/', indexRouter)
// app.use('/book', bookRouter)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

route(app)

const server = http.createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: urlui,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})

db.connect()

socket.connect(io)

// Khai báo port
var port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`App listening port http://127.0.0.1:${port}`)
})
