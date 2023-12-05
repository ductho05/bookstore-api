const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const Order = require("../models/Order")
const OrderDTO = require("../dtos/OrderDTO")
const User = require("../models/User")

const moment = require('moment');
const constants = require('../utils/api.js')
let config =
{
    vnp_TmnCode: "B5WWELNC",
    vnp_HashSecret: "DBNOFJNUFFSKXILZEOKJFOISJTZVUCLY",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    vnp_ReturnUrl: `${constants.urlapi}/orders/vnpay_return`
}
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
            const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
            // Lấy thời gian hiện tại ở Việt Nam
            const currentTimeInVietnam = moment().tz(vietnamTimeZone);
            const date =  currentTimeInVietnam.format('YYYY-MM-DD HH:mm:ss');
            const order = new Order({ ...data })
            order.date = date;
            await order.save();

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

    async createPaymentUrl(req) {
        try {
            process.env.TZ = 'Asia/Ho_Chi_Minh';

            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');

            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            //let config = require('config');

            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnpUrl = config.vnp_Url;
            let returnUrl = config.vnp_ReturnUrl;
            let orderId = moment(date).format('DDHHmmss');
            let amount = req.query.amount;
            let bankCode = '';

            // let locale = req.body.language;
            // if(locale === null || locale === ''){
            //     locale = 'vn';
            // }

            let locale = 'vn';
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            let obj = {
                data: vnpUrl,
                signed: vnp_Params.vnp_TxnRef
            }
            return new ServiceResponse(
                200,
                Status.SUCCESS,
                obj
            )
        } catch (err) {
            return new ServiceResponse(
                500,
                Status.ERROR,
                err
            )
        }
    }

    async vnpayReturn(req, res) {
        try {
            let vnp_Params = req.query;

            let secureHash = vnp_Params['vnp_SecureHash'];
        
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];
        
            vnp_Params = sortObject(vnp_Params);
        
            let tmnCode = config.vnp_TmnCode
            let secretKey = config.vnp_HashSecret
        
            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
            res.redirect(`${constants.urlui}/checkout?signed=${req.query.vnp_TxnRef}&status=${req.query.vnp_ResponseCode}`)
            return new ServiceResponse(
                200,
                Status.SUCCESS,
                req.query
            )
        } catch (err) {
            return new ServiceResponse(
                500,
                Status.ERROR,
                err
            )
        }
    }

}

module.exports = new OrderService
