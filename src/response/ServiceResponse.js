
class ServiceResponse {

    constructor(statusCode, status, message, data, token) {
        this.statusCode = statusCode
        this.status = status
        this.message = message
        this.data = data
        this.token = token
    }
}

module.exports = ServiceResponse
