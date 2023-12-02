const Response = require("../response/Response");
const OrderItemService = require("../services/OrderItemservice");
const Status = require("../utils/Status");
const Validator = require("../validator/Validator")

class OrderItemController {

    async getAllOrderItem(req, res) {

        const response = await OrderItemService.getAll()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getAllOrderItemByOrder(req, res) {

        const { error, value } = Validator.idValidator.validate(req.query.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderItemService.getByOrder(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async getAllOrderItemByOrderStatus(req, res) {

        const status = req.query.status
        const status_order = req.query.status_order
        const id = req.id

        const response = await OrderItemService.getByOrderStatus(status, status_order, id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getOrderItemById(req, res) {

        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderItemService.getById(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async insertOrderItem(req, res) {

        const { error, value } = Validator.orderItemValidator.validate(req.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderItemService.insert(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message
            ))
        }
    }

    async removeOrderItem(req, res) {
        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderItemService.delete(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message
            ))
        }
    }

    async updateOrderItem(req, res) {

        const id = req.params.id
        const { error, value } = Validator.orderItemUpdateValidator.validate(req.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderItemService.update({ _id: id }, value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message
            ))
        }
    }
}

module.exports = new OrderItemController();
