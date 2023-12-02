const jwt = require("jsonwebtoken")
const Response = require("../response/Response")
const Status = require("../utils/Status")
const Message = require("../utils/Messages")
const constants = require("../utils/api")

const authentication = (req, res, next) => {

    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        jwt.verify(token, constants.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.status(401).send(new Response(
                    Status.ERROR,
                    Message.TOKEN_EXPIRED
                ))
            } else {
                req.email = decoded.email
                req.id = decoded.id
                next()
            }
        })

    } catch (err) {

        res.status(401).send(new Response(
            Status.ERROR,
            Message.NOT_AUTH
        ))
    }
}

module.exports = authentication