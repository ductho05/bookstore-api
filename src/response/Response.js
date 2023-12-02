
class Response {
    constructor(status, message, data, token) {
        this.status = status
        this.message = message
        this.data = data
        this.token = token
    }
}

module.exports = Response