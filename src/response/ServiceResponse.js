
class ServiceResponse {

    constructor(statusCode, status, message, data, token, quantity) {
        this.statusCode = statusCode
        this.status = status
        this.message = message
        this.data = data
        this.token = token
        this.quantity = quantity
    }
}

module.exports = ServiceResponse
