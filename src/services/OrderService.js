const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const Order = require("../models/Order")
const OrderDTO = require("../dtos/OrderDTO")
const User = require("../models/User")

class OrderService {

    async getByUser(id) {

        try {

            const listOrder = await Order.find({ user: id })
                .sort({ updatedAt: -1 })
                .limit(10)
                .exec()

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                listOrder
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getTotalbyStatus() {

        try {

            const total = await Order.aggregate([
                {
                    $match: { status: "HOANTHANH" }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ])

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                total
            )
        } catch (err) {

            console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getAllByUser(page, limit, status, id) {

        try {

            var orderList = []
            if (id) {

                orderList = await Order.find({ user: id, status: new RegExp(status, "i") })
                    .populate("user")
                    .sort({ updatedAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);
            } else {

                orderList = await Order.find({ status: new RegExp(status, "i") })
                    .populate("user")
                    .sort({ updatedAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);
            }

            const orderDTOList = []
            orderList.forEach(order => {

                const orderDTO = OrderDTO.mapToOrderDTO(order)
                orderDTOList.push(orderDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderDTOList
            )
        } catch (err) {

            console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getAllByUserPagination(page, limit, id) {

        try {

            const orderList = await Order.find({ user: id })
                .populate("user")
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const orderDTOList = []
            orderList.forEach(order => {

                const orderDTO = OrderDTO.mapToOrderDTO(order)
                orderDTOList.push(orderDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderDTOList
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getAllByTime(page, limit, firstTime, lastTime) {

        try {

            const orderList = await Order.find({ createdAt: { $gte: firstTime, $lte: lastTime } })
                .populate("user")
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const orderDTOList = []
            orderList.forEach(order => {

                const orderDTO = OrderDTO.mapToOrderDTO(order)
                orderDTOList.push(orderDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderDTOList
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getAllByName(page, limit, name) {

        try {

            const orderList = await Order.find({
                $text: {
                    $search: name,
                    $caseSensitive: false,
                    $diacriticSensitive: false,
                },
            })
                .populate("user")
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const orderDTOList = []
            orderList.forEach(order => {

                const orderDTO = OrderDTO.mapToOrderDTO(order)
                orderDTOList.push(orderDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderDTOList
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getAll(page, limit, name, status, sort, id) {

        try {

            const orderList = await Order.find(
                status ? { status: new RegExp(status, "i") } : {}
            )
                .find(id ? { user: id } : {})
                .sort(sort ? { updatedAt: sort } : {})
                .limit(limit)
                .populate("user")
                .exec()

            const orderDTOList = []
            orderList.forEach(order => {

                const orderDTO = OrderDTO.mapToOrderDTO(order)
                orderDTOList.push(orderDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderDTOList
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getById(id) {

        try {

            const order = await Order.findOne({ _id: id }).populate("user").exec();

            if (order) {

                const orderDTO = OrderDTO.mapToOrderDTO(order)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.GET_DATA_SUCCESS,
                    orderDTO
                )
            } else {

                return new ServiceResponse(
                    404,
                    Status.ERROR,
                    Messages.NOT_FOUND_DATA
                )
            }

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async insert(data) {

        try {

            const order = new Order({ ...data })
            await order.save()

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.INSERT_DATA_SUCCESS,
                order
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async update(id, data) {

        try {

            const order = await Order.findByIdAndUpdate({ _id: id }, data, { new: true }).exec()

            if (order) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.UPDATE_DATA_ERROR
                )
            }

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async delete(id) {

        try {

            const order = await Order.findByIdAndRemove({ _id: id }).exec()

            if (order) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.DELETE_DATA_SUCCESS
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.DELETE_DATA_ERROR
                )
            }

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }
}

module.exports = new OrderService
