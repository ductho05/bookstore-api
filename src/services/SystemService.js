const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const System = require("../models/System")
// const SystemDTO = require("../dtos/SystemDTO")
const moment = require('moment-timezone');
const { superAdminCode } = require("../utils/api");

class SystemService {

    async checkSystem() {

        try {

            //   const listOrder = await Order.find({ user: id })
            const system = await System.findOne({ isStatus: true });


            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                system
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async checkStatus(date) {

        try {

            const system = await System.findOne({ isStatus: true });
            if (system.end < date) {
                system.isStatus = false;
                system.save();
            }
            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
            )
        } catch (err) {

            // console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async insertSystem(data) {

        try {
            // Đặt múi giờ cho Việt Nam
            const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
            // Lấy thời gian hiện tại ở Việt Nam
            const currentTimeInVietnam = moment().tz(vietnamTimeZone);
            const date = currentTimeInVietnam.format('YYYY-MM-DD');

            // const order = new Order({ ...data })
            const system = new System({ ...data });



           // console.log('system, ', system)

            if (system.type == "week") {
                // giá trị ngày thứ 2 tuần
                if (system.isRun == true) {
                    system.end = moment(date).add(6, 'days').format('YYYY-MM-DD');
                    system.start = date
                }
                // giá trị ngày thứ 2 tuần sau
                else {
                    const date = new Date();
                    const day = date.getDay();
                    const diff = date.getDate() - day + (day == 0 ? -6 : 1) - 7;
                    const mondaynext = new Date(date.setDate(diff + 14));
                    system.start = moment(mondaynext).format('YYYY-MM-DD');
                    system.end = moment(mondaynext).add(6, 'days').format('YYYY-MM-DD');
                }
            }
            // end = date + 1 tháng
            if (system.type == "month") {
                // giá trị ngày hôm nay
                if (system.isRun == true) {
                    system.end = moment(date).add(1, 'months').format('YYYY-MM-DD');
                    system.start = date
                }
                // giá trị ngày đầu tiên của tháng sau
                else {
                    const date = new Date();
                    const firstmonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                    const latemonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    system.start = moment(firstmonth).format('YYYY-MM-DD');
                    system.end = moment(latemonth).format('YYYY-MM-DD');
                }
            }
            // end = date + 1 năm
            // end = date + 1 tháng
            if (system.type == "year") {
                // giá trị ngày hôm nay
                if (system.isRun == true) {
                    system.end = moment(date).add(1, 'year').format('YYYY-MM-DD');
                    system.start = date
                }
                // giá trị ngày đầu tiên của năm sau
                else {
                    const date = new Date();
                    const firstyear = new Date(date.getFullYear() + 1, 0, 1);
                    const lateyear = new Date(date.getFullYear() + 1, 11, 31);
                    system.start = moment(firstyear).format('YYYY-MM-DD');
                    system.end = moment(lateyear).format('YYYY-MM-DD');
                }
            }
            if (data.key == superAdminCode) {
                await system.save()
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.INSERT_DATA_SUCCESS
                )
            }
            else {
                return new ServiceResponse(
                    200,
                    Status.ERROR400,
                    Messages.NOT_KEY
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

module.exports = new SystemService
