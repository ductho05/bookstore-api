const jwt = require("jsonwebtoken")
const Response = require("../response/Response")
const Status = require("../utils/Status")
const Message = require("../utils/Messages")
const constants = require("../utils/api")

const auhthorization = (req, res, next) => {

    try {

        const token = req.headers.authorization.replace('Bearer ', '')
        jwt.verify(token, constants.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.status(403).send(new Response(
                    Status.ERROR,
                    Message.TOKEN_EXPIRED
                ))
            } else {
                if (decoded.isManager) {
                    req.email = decoded.email
                    req.id = decoded.id
                    next()
                } else {
                    res.status(403).send(new Response(
                        Status.ERROR,
                        Message.NOT_AUTH
                    ))
                }
            }
        })

    } catch (err) {
        res.status(403).send(new Response(
            Status.ERROR,
            Message.NOT_AUTH
        ))
    }

}

module.exports = auhthorization
