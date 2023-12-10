const Response = require("../response/Response");
const OrderService = require("../services/OrderService");
const Status = require("../utils/Status");
const Validator = require("../validator/Validator")

class OrderController {

    async getAllOrderByUser(req, res) {

        const id = req.id
        const limit = req.query.limit

        const response = await OrderService.getByUser(id, limit)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy tổng số lượng đơn hàng theo cả 5 trạng thái
    async getTotalOrderByStatus(req, res) {

        const response = await OrderService.getTotalbyStatus()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy đơn hàng theo trạng thái đơn hàng
    async getAllOrderByStatus(req, res) {

        const page = req.query.page;
        const limit = req.query.limit;
        const status = req.query.status;
        const user = req.query.user
        const id = req.id

        const response = await OrderService.getAllByUser(page, limit, status, id, user)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy đơn hàng theo phân trang
    async getAllOrderPaginaion(req, res) {

        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const id = req.query.id

        const response = await OrderService.getAllByUserPagination(page, limit, id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy tất cả đơn hàng theo thời gian tạo đơn hàng
    async getAllOrderByTime(req, res) {
        const page = req.query.page;
        const limit = req.query.limit;
        const firstTime = req.query.ftime;
        const lastTime = req.query.ltime;

        const response = await OrderService.getAllByTime(page, limit, firstTime, lastTime)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Tìm kiếm đơn hàng theo tên
    async getAllOrderByName(req, res) {
        const name = req.query.name;
        const page = req.query.page;
        const limit = req.query.limit;

        const response = await OrderService.getAllByName(page, limit, name)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy tất cả các đơn hàng
    async getAllOrders(req, res) {

        var page = req.query.page;
        var limit = req.query.limit;
        var status = req.query.status;
        var name = req.query.name;
        var firstTime = req.query.ftime;
        var lastTime = req.query.ltime;
        var sort = req.query.sort;
        var id = req.query.id;

        const response = await OrderService.getAll(page, limit, name, status, sort, id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy 1 đơn hàng theo id
    async getOrderById(req, res) {

        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderService.getById(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }

    }

    // Thêm mới 1 đơn hàng
    async insertOrder(req, res) {

        const { error, value } = Validator.orderValidator.validate(req.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderService.insert(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    // Xóa một đơn hàng
    async removeOrder(req, res) {

        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderService.delete(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    // Cập nhật một đơn hàng
    async updateOrder(req, res) {

        const id = req.params.id
        const { error, value } = Validator.orderUpdateValidator.validate(req.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await OrderService.update(id, value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async createPaymentUrl(req, res) {

        const response = await OrderService.createPaymentUrl(req)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
        // return res.json(obj);
    }

    async vnpayReturn(req, res) {
        const response = await OrderService.vnpayReturn(req, res)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
        ))
    }
}

module.exports = new OrderController();
