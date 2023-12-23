const Response = require("../response/Response");
const FlashUserService = require("../services/FlashUserService");
const Status = require("../utils/Status");
const Validator = require("../validator/Validator")

class FlashUserControllers {

    // Lấy dữ liệu sách theo id
    async getFlashById(req, res) {

        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await FlashUserService.getById(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    // Lấy tất cả dữ liệu sách + phân trang + sắp theo giá
    async getFlash(req, res) {

        // Tên danh mục
        var flashId = req.query.flashId;
        var userid = req.query.userid;
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


        var date = req.query.date;
        var point = req.query.point;

        var enddate = req.query.enddate;

        const response = await FlashUserService.getFlash(flashId, start, end, sort, filter)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Thêm dữ liệu sách
    async addFlash(req, res) {

        //console.log('req.body', req)
        const data = req.body 
        // console.log('àdcsafsdf', data)

        const response = await FlashUserService.add(data)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Sửa dữ liệu sách theo id
    // Sửa dữ liệu sách theo id
    async updateFlashUser(req, res) {

        const id = req.params.id
        const updateFlash = req.body
        const response = await FlashUserService.update(id, updateFlash)

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
    async deleteFlashUser(req, res) {

        const id = req.params.id

        const response = await FlashSaleService.delete(id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

}


module.exports = new FlashUserControllers();
