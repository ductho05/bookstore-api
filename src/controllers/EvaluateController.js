const EvaluateService = require("../services/EvaluateService")
const Response = require("../response/Response")
const Validator = require("../validator/Validator")
const Status = require("../utils/Status")

class EvaluateController {

    async getAllComment(req, res) {

        const response = await EvaluateService.getAll()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async likeComment(req, res) {

        const uid = req.id
        const { error, value } = Validator.idValidator.validate(req.query.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await EvaluateService.like(uid, value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async getCountEvaluateByProductId(req, res) {

        const { error, value } = Validator.idValidator.validate(req.query._id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await EvaluateService.countByProductId(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async getEvaluateByUser(req, res) {

        const email = req.email

        const response = await EvaluateService.getByUser(email)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))

    }

    async getEvaluateByProductId(req, res) {

        var id = req.query._id
        var sort = req.query.sort
        let typeSort = -1

        const response = await EvaluateService.getByProduct(id, sort, typeSort)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))

    }

    async insertEvaluate(req, res) {
        const { error, value } = Validator.evaluateValidator.validate(req.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await EvaluateService.insert(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }
}


module.exports = new EvaluateController