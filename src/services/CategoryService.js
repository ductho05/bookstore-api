const Category = require("../models/Category")
const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")

class CategoryService {

    async getAll(filter, limit, lock) {
        try {

            const data = filter != "simple" ? await Category.aggregate([
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
                        categories: {
                            $push: {
                                $cond: [
                                    { $eq: ['$status', true] },
                                    '$$ROOT',
                                    null
                                ]
                            }
                        }
                    }
                }
            ]) : await Category.find(lock ? { status: true } : {}).limit(limit).exec();

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

                const randomId = Math.floor(Math.random() * 999) + 1
                let findId = null
                while (findId) {

                    randomId += 1
                    findId = Category.findOne({ _id: randomId })
                }
                const newCategory = new Category({ ...category, _id: randomId })
                await newCategory.save()

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.INSERT_CATEGORY_SUCCESS
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

    async update(filter, data) {

        try {

            const categoryUpdate = await Category.findByIdAndUpdate(filter, data).exec()

            if (categoryUpdate) {

                const category = await Category.findOne({ _id: categoryUpdate._id })

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_CATEGORY_SUCCESS,
                    category
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

    async updateMany() {
        try {

            // const ids = ["872", "54978", "385", "6994", "850", "3272", "871", "863", "372", "852"]
            // const ids = ["854", "7358", "444", "1084", "6750", "845", "665", "8973", "664", "1753", "1367", "6040", "840", "1521", "855"]
            // const ids = ["2", "847", "369", "5246", "848", "483", "4144", "849", "593", "716", "372"]
            // const ids = ["30", "1922", "879", "6138", "26902", "316"]
            // const ids = ["9733", "9725", "853", "9724", "861", "5244", "282", "9728", "6993", "446", "859", "6992", "903", "9120", "1856", "844", "14872", "2250", "7671", "877", "1527", "251", "885", "1881", "1754", "842", "843"]
            // const ids = ["3320", "4933", "30", "8322", "320", "9", "162", "886", "865", "5245", "6225", "9727", "867"]
            const ids = ["18346", "1925", "3893", "4261", "1909", "4314", "18342", "2539", "1858", "9216", "4624", "18332", "18380", "8265", "4142", "856", "6905", "1860", "8264", "6541", "8934", "1875", "1862", "2368", "24734", "3898", "3986", "7741", "1874", "1908", "1916", "1899", "4313", "18394", "1343", "1870"]
            await Category.updateMany({ _id: { $in: ids } }, { field: "658bc9b500deacc882cc3b97" })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.UPDATE_CATEGORY_SUCCESS
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
}

module.exports = new CategoryService
