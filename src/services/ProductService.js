const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const ProductDTO = require("../dtos/ProductDTO")
const Product = require("../models/Product")
const Category = require("../models/Category")

class ProductService {

    async getALL(minPrice, maxPrice, rate, category, title, num, start, end, sort, filter) {

        try {

            console.log(sort)
            let customSort = { "updatedAt": -1 }
            if (sort) {
                if (filter == "price") {
                    if (sort == "asc") {
                        customSort = { "price": 1 }
                    }
                    if (sort == "desc") {
                        customSort = { "price": -1 }
                    }
                }
                if (filter == "sold") {
                    if (sort == "asc") {
                        customSort = { "sold": 1 }
                    }
                    if (sort == "desc") {
                        customSort = { "sold": -1 }
                    }
                }
                if (filter == "rate") {
                    if (sort == "asc") {
                        customSort = { "rate": 1 }
                    }
                    if (sort == "desc") {
                        customSort = { "rate": -1 }
                    }
                }
                // if (filter == "published_date") {
                //     data.sort(function (a, b) {
                //         let dateA = new Date(a.published_date);
                //         let dateB = new Date(b.published_date);
                //         if (sort == "asc") {
                //             return dateA - dateB;
                //         }
                //         if (sort == "desc") {
                //             return dateB - dateA;
                //         }
                //     });
                // }
                // if (filter == "title") {
                //     data.sort(function (a, b) {
                //         if (sort == "asc") {
                //             return a.title - b.title;
                //         }
                //         if (sort == "desc") {
                //             return b.title - a.title;
                //         }
                //     });
                // }
                // if (filter == "author") {
                //     data.sort(function (a, b) {
                //         if (sort == "asc") {
                //             return a.author - b.author;
                //         }
                //         if (sort == "desc") {
                //             return b.author - a.author;
                //         }
                //     });
                // }
                // if (filter == "status") {
                //     data.sort(function (a, b) {
                //         if (sort == "asc") {
                //             return a.status - b.status;
                //         }
                //         if (sort == "desc") {
                //             return b.status - a.status;
                //         }
                //     });
                // }
                // if (filter == "discount") {
                //     data.sort(function (a, b) {
                //         let discountA = a.old_price / a.price;
                //         let discountB = b.old_price / b.price;
                //         if (sort == "asc") {
                //             return discountA - discountB;
                //         }
                //         if (sort == "desc") {
                //             return discountB - discountA;
                //         }
                //     });
                // }
            }

            const data = await Product
                .find(category ? { categoryId: category } : {})
                .find(title ? { title: new RegExp(title, "i") } : {})
                .find({ images: { $ne: null } })
                .find(rate ? { rate } : {})
                .find(minPrice ? { price: { $gte: minPrice } } : {})
                .find(minPrice && maxPrice ? { price: { $gte: minPrice, $lte: maxPrice } } : {})
                .populate("categoryId")
                .skip(start)
                .limit(end)
                .sort(customSort)

            const quantity = await Product
                .find(category ? { categoryId: category } : {})
                .find(title ? { title: new RegExp(title, "i") } : {})
                .find({ images: { $ne: null } })
                .find(rate ? { rate } : {})
                .find(minPrice ? { price: { $gte: minPrice } } : {})
                .find(minPrice && maxPrice ? { price: { $gte: minPrice, $lte: maxPrice } } : {})
                .countDocuments()

            const result = {
                products: data,
                quantity
            }

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                result
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

    async count(id) {

        try {

            let data
            if (id) {

                data = await Product.count({ categoryId: id })
            } else {

                data = await Product.count()
            }

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getBestSellerLimit() {

        try {

            const data = await Product.find()

            const newData = data.sort((a, b) => b.sold - a.sold).splice(0, 6)

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                newData
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

            const data = await Product.findById(id)
                .populate("categoryId")
                .exec();

            if (data) {

                const productDTO = ProductDTO.mapToProductDTO(data)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.GET_DATA_SUCCESS,
                    productDTO
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

    async countByCategory() {

        try {

            const data = await Product.aggregate([
                {
                    $group: {
                        _id: "$categoryId",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ])

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async countByRate() {

        try {

            const data = await Product.aggregate([
                {
                    $group: {
                        _id: "$rate",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: -1 } },
            ])

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getByName(title, num) {

        try {

            const data = await Product.find({ title: new RegExp(title, "i") })
                .populate("categoryId")
                .limit(num)
                .exec()

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getByAuthor(author) {

        try {

            const data = await Product.find({
                author: new RegExp(author, "i"),
            }).populate("categoryId")

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getByYear(start, end) {

        try {

            const data = await Product.find({
                published_date: { $gte: start, $lte: end },
            }).populate("categoryId")

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getNew(num) {

        try {

            const data = await Product.find()
                .populate("categoryId")
                .sort({
                    published_date: -1,
                })
                .limit(num)

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getLowest(num) {

        try {

            const data = await Product.find()
                .sort({
                    price: 1,
                })
                .populate("categoryId")
                .limit(num)

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getBestSale(num) {

        try {

            const data = await Product.find()
                .populate("categoryId")
                .sort({
                    sold: -1,
                })
                .limit(num)
                .exec()

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getByPrice(start, end, sort) {

        try {

            const data = await Product.find({
                price: { $gte: start, $lte: end },
            })
                .sort({ price: sort })
                .populate("categoryId")

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getByCategoryName() {

        try {

            const category = await Category.findOne({
                name: "Lịch Sử Thế Giới",
            }).exec()

            const data = await Product.find({
                "category.name": category.name,
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
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

    async getByCategory(id, limit) {

        try {

            const data = await Product.find({ categoryId: id })
                .limit(limit)
                .populate("categoryId")
                .exec()

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                data
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

    async insert(data) {

        try {

            const product = new Product({ ...data })

            const findProduct = await Product.findOne({ title: product.title }).exec()

            if (findProduct) {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.PRODUCT_IS_EXISTING
                )
            } else {

                const category = await Category.findOne({ _id: product.categoryId }).exec()

                if (category) {

                    await product.save()

                    return new ServiceResponse(
                        200,
                        Status.SUCCESS,
                        Messages.INSERT_DATA_SUCCESS,
                        product
                    )
                } else {

                    return new ServiceResponse(
                        400,
                        Status.ERROR,
                        Messages.CATEGORY_NOT_FOUND
                    )
                }
            }


        } catch (err) {

            console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async update(filter, updateProduct) {

        try {

            const result = await Product.findByIdAndUpdate(filter, updateProduct).exec()

            if (result) {

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

            console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async updateSold(filter, sold1) {

        try {

            //console.log('filter212', filter, sold1, await Product.findById({ _id: filter._id }).exec())

            const data1 = await Product.findById({ _id: filter._id }).exec()
            //console.log('data1', data1.quantity)
            const sold_pro = Number(data1.sold) + Number(sold1)
            const quantity_pro = Number(data1.quantity) - Number(sold1)
            const result = await Product.findByIdAndUpdate({ _id: filter._id }, {
                // giá trị sold sẽ được cộng thêm sold1
                sold: sold_pro,
                // giá trị quantity sẽ được trừ đi sold1
               quantity: quantity_pro },
                // các trường còn lại giữ nguyên
            ).exec()
           

            // tìm lại sản phẩm vừa được update
            const result1=    await Product.findById({ _id: filter._id }).exec()
            console.log('result', result1)

            if (result) {
                // console.log('asdsfa', result)

                // const newSold = sold + result.sold
                // const newQuantity = result.quantity - sold
                // result.sold = newSold
                // result.quantity = newQuantity

                // await result.save()
                               
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

            console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async delete(id) {

        try {

            const product = await Product.findByIdAndRemove({ _id: id }).exec()

            if (product) {

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

            console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }
}

module.exports = new ProductService
