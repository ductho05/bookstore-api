const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const OrderItem = require("../models/OrderItem")
const OrderItemDTO = require("../dtos/OrderItemDTO")

class OrderItemService {

    async getAll() {

        try {

            const orderItemList = await OrderItem.find()
                .populate("order")
                .populate("product")
                .exec();

            const orderItemDTOList = []

            orderItemList.forEach(orderItem => {

                //const orderItemDTO = OrderItemDTO.mapToOrderItemDTO(orderItem)
                orderItemDTOList.push(orderItem)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderItemDTOList
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

    async getByOrder(id) {

        try {

            const orderItemList = await OrderItem.find({ order: id })
                .populate("order")
                .populate({
                    path: "product",
                    populate: {
                        path: "categoryId",
                        model: "Category"
                    }
                })
                .exec()

            const orderItemDTOList = []

            orderItemList.forEach(orderItem => {

                const orderItemDTO = OrderItemDTO.mapToOrderItemDTO(orderItem)
                orderItemDTOList.push(orderItemDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderItemDTOList
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getByOrderStatus(status, status_order, user) {

        try {
            const orderItemList = await OrderItem.find(status ? { status: status } : {})
                .populate("order")
                .populate({
                    path: "product",
                    populate: {
                        path: "categoryId",
                        model: "Category"
                    }
                })
                .exec()

            let newData = []
            if (status) {

                newData = orderItemList.filter((orderItem) =>
                    orderItem?.order?.status == status_order && orderItem?.order?.user == user)
            } else {

                newData = orderItemList.filter((orderItem) =>
                    orderItem?.order?.status == status_order)
            }

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                newData
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

    async getById(id) {

        try {

            const orderItem = await OrderItem.findOne({ _id: id })
                .populate("order")
                .populate("product")
                .exec()

            const orderItemDTO = OrderItemDTO.mapToOrderItemDTO(orderItem)

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                orderItemDTO
            )
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
            
            // console.log('adta24343121', data)
            const orderItem = new OrderItem({ ...data })
            await orderItem.save()

            // kiểm tra nếu sản phẩm trong giỏ hàng trong flashsale thì update lại số lượng flashsale
            // const flashsale = await FlashSale.findOne({ product: data.product,  })
            // if (flashsale) {                    
            //         flashsale.sold_sale = flashsale.sold_sale + data.quantity
            //         await flashsale.save()
            //     }

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.INSERT_DATA_SUCCESS
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async update(filter, data) {

        try {

            const orderItem = await OrderItem.findByIdAndUpdate(filter, data).exec()

            if (orderItem) {
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS
                )
            } else {

                return new ServiceResponse(
                    400,
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

    async delete(id) {

        try {

            const orderItem = await OrderItem.findByIdAndRemove({ _id: id }).exec()

            if (orderItem) {
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.DELETE_DATA_SUCCESS
                )
            } else {

                return new ServiceResponse(
                    400,
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
}

module.exports = new OrderItemService
