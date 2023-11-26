const Category = require("../models/Category");
const responeObject = require("../models/responeObject");
const CategoryService = require("../services/CategoryService")
const Response = require("../response/Response")
const Validator = require("../validator/Validator")
const Status = require("../utils/Status")

const resObj = new responeObject("", "", {});

class CategoryControllers {

    async getAllCategory(req, res) {

        const response = await CategoryService.getAll()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getCategoryById(req, res) {

        const { error, value } = Validator.idCategoryValidator.validate(req.params.id)

        if (error) {
            return res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await CategoryService.getByField({ _id: value })

            return res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async addCategory(req, res) {

        const { error, value } = Validator.categoryValidator.validate(req.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await CategoryService.insert(value)

            return res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async updateCategory(req, res) {

        const id = req.params.id
        const { error, value } = Validator.categoryUpdateValidator.validate(re.body)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = CategoryService.update({ _id: id }, value)

            return res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }
}

module.exports = new CategoryControllers();
