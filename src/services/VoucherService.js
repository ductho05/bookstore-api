const mongoose = require("mongoose")
// const Voucher = require("../models/Voucher")
const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
// const EvaluateDTO = require("../dtos/EvaluateDTO")
const User = require("../models/User")
const Voucher = require("../models/Voucher")

class VoucherService {

    async getAll(req) {
        try {
            const statusFilter = req.query.status;
            const userFilter = req.query.user;
            const codeFilter = req.query.code;
            const discountFilter = req.query.discount;
            const expriedFilter = req.query.expried;
            // console.log(req.query);

            const conditions = {};

            if (statusFilter) conditions.status = statusFilter;
            if (userFilter) conditions.user = userFilter;
            if (codeFilter) conditions.code = codeFilter;
            if (discountFilter) conditions.discount = discountFilter;
            if (expriedFilter) conditions.expried = expriedFilter;

            const data = await Voucher.find(conditions)
                .populate("user")
                .sort({ createdAt: -1 })
                .exec();

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            );
        } catch (err) {
            console.log(err);
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            );
        }
    }

    async getByName(code) {
        try {

            console.log(code)
            const vouchers = await Voucher.find()

            const newVouchers = vouchers.filter(voucher => voucher.code.startsWith(code))

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                newVouchers
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
            const newVoucher = new Voucher({ ...data })
            await newVoucher.save()
           // await newVoucher.execPopulate("user");

           await newVoucher.populate("user");

            if (newVoucher) {
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.INSERT_DATA_SUCCESS,
                    newVoucher
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

    async update(id, data) {
        try {
            console.log("data111", data)
            const updateData = await Voucher.findByIdAndUpdate(id, { ...data })
            if (updateData) {
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS,
                    updateData
                )
            } else {
                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.NOT_FOUND_DATA
                )
            }
        }
        catch (err) {
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }
}

module.exports = new VoucherService
