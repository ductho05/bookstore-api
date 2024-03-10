const Validator = require("../validator/Validator")
const UserService = require("../services/UserService")
const Response = require("../response/Response")
const Status = require("../utils/Status")

class UserController {

    async forgetPassword(req, res) {

        const { error, value } = Validator.forgetValidator.validate(req.body)
        if (error) {
            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await UserService.forgetPasswordUser(value.email, value.password)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data,
                response.token
            ))
        }

    }

    async verifyOTP(req, res) {

        const { error, value } = Validator.emailValidator.validate(req.body.email)
        if (error) {
            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const email = value
            const otp = Math.floor(1000 + Math.random() * 10000)
            const subject = "Xác nhận mã OTP"
            const html = `<div>Mã xác thực OTP <p style='font-size: 16px; color: red'; font-weight: 500;>${otp}</p></div>`

            const response = await UserService.sendEmail(email, subject, html, otp)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }

    }

    async getProfile(req, res) {

        const email = req.email

        const response = await UserService.getProfileByEmail(email)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async loginWithFacebook(req, res) {

        const { error, value } = Validator.authFacebookValidator.validate(req.body)
        const { email, username, image, faceId } = value

        if (error) {
            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const response = await UserService.loginWithFacebook(email, username, image, faceId)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data,
                response.token
            ))
        }
    }

    async loginUser(req, res) {

        const { error, value } = Validator.authValidator.validate(req.body)
        const { email, password } = value

        if (error) {
            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const response = await UserService.login(email, password)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data,
                response.token
            ))
        }
    }

    async registerUser(req, res) {

        const { error, value } = Validator.authValidator.validate(req.body)
        const { email, password, fullName } = value

        if (error) {
            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const response = await UserService.register(email, password, fullName)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data,
                response.token
            ))
        }
    }

    async active(req, res) {

        const { error, value } = Validator.emailValidator.validate(req.body.email)

        if (error) {
            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const response = await UserService.activeUser(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message
            ))
        }
    }

    async getAllUser(req, res) {

        const page = req.query.page
        const limit = req.query.limit

        let response
        response = page && limit ? await UserService.getAllPagination(page, limit)
            : await UserService.getAll()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getAllUserByTime(req, res) {
        const page = req.query.page
        const limit = req.query.limit
        const firstTime = req.query.ftime;
        const lastTime = req.query.ltime;

        const response = await UserService.getAllByTime(page, limit, firstTime, lastTime)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getAllUserByName(req, res) {
        const name = req.query.name
        const page = req.query.page || 1
        const limit = req.query.limit || 10

        const response = await UserService.getAllByName(page, limit, name)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getUserById(req, res) {

        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const response = await UserService.getByField({ _id: value })

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async getUserByEmail(req, res) {

        const { error, value } = Validator.emailValidator.validate(req.query.email)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const response = await UserService.getByField({ email: value })

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async insertUser(req, res) {

        const { error, value } = Validator.userValidator.validate(req.body)
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
            const response = await UserService.insert(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async removeUser(req, res) {

        const { error, value } = Validator.idValidator.validate(req.params.id)

        if (error) {
            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {
            const response = await UserService.delete(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message
            ))
        }
    }

    async updateUser(req, res) {

        const id = req.params.id
        const { error, value } = Validator.userUpdateValidator.validate(req.body)

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
            const response = await UserService.update({ _id: id }, value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async updateUserEmail(req, res) {

        const id = req.id
        const email = req.body.email

        console.log(id, email)

        const response = await UserService.updateEmail(id, email)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data,
            response.token
        ))
    }
}

module.exports = new UserController