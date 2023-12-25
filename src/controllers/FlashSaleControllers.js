const Response = require("../response/Response");
const FlashSaleService = require("../services/FlashSaleService");
const Status = require("../utils/Status");
const Validator = require("../validator/Validator")
const { format } = require('date-fns-tz');
const moment = require('moment-timezone');
class FlashSaleControllers {

    async getFlashById(req, res) {
        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            // var filter = req.query.filter;
            var mount = req.query.mount;
            const response = await FlashSaleService.getById(value, mount)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async getProduct(req, res) {

        // Tên danh mục
        var categoryId = req.query.categoryId;

        // Lấy num sản phẩm thôi
        var num = req.query.num;
        // Số trang
        var page = parseInt(req.query.page);
        // Số sản phẩm trên 1 trang
        var perPage = parseInt(req.query.perPage);
        // Tính số sản phẩm bỏ qua
        var start = (page - 1) * perPage;
        // Tính số sản phẩm lấy ra
        var end = perPage ? perPage : num

        // Sắp xếp
        var sort = req.query.sort;

        // Sắp xếp theo trường nào đó
        var filter = req.query.filter;
        var productId = req.query.productId;

        var date = req.query.date;
        var point = req.query.point;

        var enddate = req.query.enddate;

        const response = await FlashSaleService.getProduct(categoryId, start, end, sort, filter, productId, date, point, enddate)
console.log("flashSalesWithCategory: ", response);
        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Thêm dữ liệu sách
    async addProduct(req, res) {

        // Đặt múi giờ cho Việt Nam
        const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

        // Lấy thời gian hiện tại ở Việt Nam
        const currentTimeInVietnam = moment().tz(vietnamTimeZone);

        // Lấy số giờ hiện tại
        const currentHourInVietnam = currentTimeInVietnam.get('hours');

        const currentDate = new Date();
        const inputDate = new Date(req.body.date_sale);

        const currentHour = currentDate.getHours();
        const inputTime = req.body.point_sale;

        let toDay =   format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
        let inputDay = format(inputDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });

        const body = { ...req.body }

        const response = await FlashSaleService.addProduct(currentHourInVietnam, currentHour, inputTime, toDay, inputDay, body)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))

        console.log(response.message)
    }

    // Sửa dữ liệu sách theo id
    // Sửa dữ liệu sách theo id
    async updateFlashSale(req, res) {

        // Đặt múi giờ cho Việt Nam
        const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

        // Lấy thời gian hiện tại ở Việt Nam
        const currentTimeInVietnam = moment().tz(vietnamTimeZone);

        // Lấy số giờ hiện tại
        const currentHourInVietnam = currentTimeInVietnam.get('hours');

        const currentDate = new Date();

        let toDay =   format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });

        const id = req.params.id
        const updateProduct = req.body

        const response = await FlashSaleService.update(id, updateProduct, currentHourInVietnam, toDay)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))

    }

    // Hàm kiểm tra và xóa Flash Sale hết hạn
    async checkAndDeleteExpiredSales(req, res) {

        const response = await FlashSaleService.deleteExpired()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))

    }

    // Xóa dữ liệu sách theo id
    async deleteFlashSale(req, res) {

        const id = req.params.id

        const response = await FlashSaleService.delete(id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async addLoopSale(req, res) {
  
          await FlashSaleService.addLoopSale();
            // console.log(response.statusCode, res)
            //     res.status(response.statusCode).json(new Response(
            //     // response.status,
            //     // response.message,
            //     // response.data
            //   ))
        } 


    async checkAndUpdatePrice(req, res) {
        // console.log("checkAndUpdatePrice")            
        await FlashSaleService.checkAndUpdatePrice()
    
            // res.status(response.statusCode).json(new Response(
            //     response.status,
            //     response.message,
            // ))
    }       

}


module.exports = new FlashSaleControllers();
