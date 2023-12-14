
class Response {
    constructor(status, message, data, token, quantity) {
        this.status = status
        this.message = message
        this.data = data
        this.token = token
        this.quantity = quantity
    }
}

module.exports = Response