const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const ProductDTO = require("../dtos/ProductDTO")
const Product = require("../models/Product")
const Category = require("../models/Category")

class ProductService {

    async getALL(minPrice, maxPrice, rate, category, title, num, start, end, sort, filter) {

        try {

           // console.log(sort)
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
                .find(category ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { categoryId: category }] } : {})
                .find(title ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { title: new RegExp(title, "i") }] } : {})
                .find({ images: { $ne: null } })
                .find(rate ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { rate }] } : {})
                .find(minPrice ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { price: { $gte: minPrice } }] } : {})
                .find(minPrice && maxPrice ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { price: { $gte: minPrice, $lte: maxPrice } }] } : {})
                .populate("categoryId")
                .skip(start)
                .limit(end)
                .sort(customSort)

            const quantity = await Product
                .find(category ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { categoryId: category }] } : {})
                .find(title ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { title: new RegExp(title, "i") }] } : {})
                .find({ images: { $ne: null } })
                .find(rate ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { rate }] } : {})
                .find(minPrice ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { price: { $gte: minPrice } }] } : {})
                .find(minPrice && maxPrice ? { $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { price: { $gte: minPrice, $lte: maxPrice } }] } : {})
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

           // console.log(err)
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

            const data = await Product
                .find({ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] })
                .limit(6)
                .sort({ "sold": -1 })

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

    async getById(id) {

        try {

            const data = await Product.findOne({ $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { _id: id }] })
                .populate("categoryId")
                .exec();

            if (data) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.GET_DATA_SUCCESS,
                    data
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

            const data = await Product.find({ $and: [{ title: new RegExp(title, "i") }, { $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }] })
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
                $and: [
                    { $or: [{ status_sell: { $exists: false } }, { status_sell: true }] },
                    { author: new RegExp(author, "i") }
                ]
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
                $and: [
                    { published_date: { $gte: start, $lte: end } },
                    { $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }
                ]
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

            const data = await Product.find({ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] },)
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

            const data = await Product.find({ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] },)
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

            const data = await Product.find({ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] },)
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
                $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] },
                { price: { $gte: start, $lte: end } }
                ]
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
                $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] },
                { name: "Lịch Sử Thế Giới" }
                ]
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

           // console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getByCategory(id, limit) {

        try {

            const data = await Product.find({ $and: [{ $or: [{ status_sell: { $exists: false } }, { status_sell: true }] }, { categoryId: id }] })
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

           // console.log(err)
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

            if (product.old_price < product.price) {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.ERROR_PRICE
                )
            }

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

           // console.log(err)
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

                const product = await Product.findOne({ _id: result._id }).exec()
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS,
                    product
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.UPDATE_DATA_ERROR
                )
            }

        } catch (err) {

           // console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

  

    async updateSold(req) {
        const {list} = req
        try {       
            async function updatePrices() {
                for (const item of list) {
                    const result = await Product.findById({ _id: item.id }).exec();
                    if (result) {
                        result.sold = result.sold + item.sold;
                        result.quantity = result.quantity - item.sold;
                        await result.save();
                        //console.log('newList', result, await Product.findById({ _id: item.id }).exec());
                    }
                }
            }

            updatePrices();            

       
            if (true) {       
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS,
                   // newList
                )
            } else {

                return new ServiceResponse(
                    200,
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

           // console.log(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }
}

module.exports = new ProductService
