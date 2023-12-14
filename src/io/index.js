const User = require('../models/User')

const connect = (io) => {

    let listUserConnect = []

    io.on('connection', (socket) => {
        console.log('A new user connected ', socket.id)

        socket.on('save-socket', async (userId) => {
            listUserConnect.push({
                socketId: socket.id,
                userId: userId
            })
        })

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id)
            const newListUserConnect = listUserConnect.filter(user => user.socketId != socket.id)
            listUserConnect = [...newListUserConnect]
        })

        socket.on('send-notification', ({ type, userId, notification }) => {

            console.log("Gửi thông báo")

            io.emit('response-notification', { type, userId, notification })
        })
    })
}

module.exports = { connect }
