const ProductDTO = require("../dtos/ProductDTO");
const Response = require("../response/Response");
const ProductService = require("../services/ProductService");
const Status = require("../utils/Status");
const Validator = require("../validator/Validator")

class ProductControllers {

    async getAllProduct(req, res) {

        var category = req.query.category;

        // Tên sách
        var title = req.query.title;
        // Lấy num sản phẩm thôi
        var num = req.query.num;

        // Số trang
        var page = parseInt(req.query.page);
        // Số sản phẩm trên 1 trang
        var perPage = parseInt(req.query.perPage);
        // Tính số sản phẩm bỏ qua
        var start = (page - 1) * perPage;
        // Tính số sản phẩm lấy ra
        var end = perPage ? perPage : num;

        // Sắp xếp
        var sort = req.query.sort;

        // Sắp xếp theo trường nào đó
        var filter = req.query.filter;

        const response = await ProductService.getALL(category, title, num, start, end, sort, filter)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getCountProduct(req, res) {

        const id = req.query.category

        const response = await ProductService.count(id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy 6 sản phẩm được bán chạy nhất
    async getProductBestSellerLimit(req, res) {

        const response = await ProductService.getBestSellerLimit()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy dữ liệu sách theo id
    async getProductById(req, res) {

        const { error, value } = Validator.idValidator.validate(req.params.id)
        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await ProductService.getById(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    // Tìm 5 category co nhiều sản phẩm nhất
    async getNumProductByCategory(req, res) {

        const response = await ProductService.countByCategory()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }


    // Tìm tổng số sản phẩm có rate bằng 5
    async getNumProductByRate(req, res) {

        const response = await ProductService.countByRate()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy dữ liệu sách theo tên
    async getProductByName(req, res) {

        var title = req.params.title;
        var num = parseInt(req.query.num) || 6;

        const response = await ProductService.getByName(title, num)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy dữ liệu sách theo tác giả
    async getProductByAuthor(req, res) {

        var author = req.params.author

        const response = await ProductService.getByAuthor(author)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy dữ liệu sách theo khoảng năm xuất bản
    async getProductByYear(req, res) {

        var start = req.params.start
        var end = req.params.end

        const response = await ProductService.getByYear(start, end)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy sách mới nhất
    async getNewProduct(req, res) {

        var num = parseInt(req.params.num) || 8

        const response = await ProductService.getNew(num)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy sách rẻ nhất
    async getLowestProduct(req, res) {

        var num = parseInt(req.params.num) || 8

        const response = await ProductService.getLowest(num)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy sách bán chạy nhất
    async getBestSellerProduct(req, res) {

        var num = parseInt(req.params.num) || 8

        const response = await ProductService.getBestSale(num)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy dữ liệu sách theo khoảng giá và sắp xếp theo giá
    async getProductByPrice(req, res) {

        const start = req.params.start;
        const end = req.params.end;
        const sort = req.params.sort;

        const response = await ProductService.getByPrice(start, end, sort)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    //Tìm các sách có tên danh mục là "Sách giáo khoa"
    async getProductByCategoryName(req, res) {

        const response = await ProductService.getByCategoryName()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Lấy sách theo danh mục
    async getProductByCategory(req, res) {

        var limit = req.query.limit || 0;
        var id = req.query.category;

        const response = await ProductService.getByCategory(id, limit)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    // Thêm dữ liệu sách
    async addProduct(req, res) {

        const { error, value } = Validator.productValidator.validate(req.body)
        const file = req.file
        if (file) {
            value.images = file.path
        }

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await ProductService.insert(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    // Sửa dữ liệu sách theo id
    async updateProduct(req, res) {

        const id = req.params.id
        const { error, value } = Validator.productUpdateValidator.validate(req.body)
        const file = req.file
        if (file) {
            value.images = file.path
        }

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await ProductService.update({ _id: id }, value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message
            ))
        }
    }

    async updateSoldProduct(req, res) {

        const id = req.params.id
        const { error, value } = Validator.soldValidator.validate(req.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const sold = value.sold
            const response = await ProductService.updateSold({ _id: id }, sold)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message
            ))
        }
    }

    // Xóa dữ liệu sách theo id
    async deleteProduct(req, res) {

        const id = req.params.id

        const response = await ProductService.delete(id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message
        ))
    }
}

module.exports = new ProductControllers();
