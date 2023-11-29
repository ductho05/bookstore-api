const Category = require("../models/Category")
const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")

class CategoryService {

    async getAll() {
        try {

            const data = await Category.aggregate([
                {
                    $addFields: {
                        field: {
                            $toObjectId: '$field'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'fields',
                        localField: 'field',
                        foreignField: '_id',
                        as: 'field'
                    }
                },
                {
                    $unwind: '$field'
                },
                {
                    $group: {
                        _id: '$field.name',
                        categories: { $push: '$$ROOT' }
                    }
                }
            ])

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_CATEGORY_SUCCESS,
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

    async getByField(field) {

        try {

            const category = await Category.findOne(field)

            if (category) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.GET_CATEGORY_SUCCESS,
                    category
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

    async insert(category) {

        try {

            const findCategory = await Category.findOne({ name: category.name }).exec()

            if (findCategory) {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.CATEGORY_EXISTS
                )
            } else {

                const newCategory = new Category({ ...category })
                await newCategory.save()

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.INSERT_CATEGORY_SUCCESS
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

    async update(filter, data) {

        try {

            const categoryUpdate = await Category.findByIdAndUpdate(filter, data).exec()

            if (categoryUpdate) {
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_CATEGORY_SUCCESS
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

module.exports = new CategoryService