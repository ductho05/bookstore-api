const ServiceResponse = require("../response/ServiceResponse")
const User = require('../models/User')
const UserDTO = require('../dtos/UserDTO')
const Messages = require("../utils/Messages")
const Status = require("../utils/Status")
const constants = require('../utils/api.js')
const transporter = require("../config/mail")

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserService {

    async forgetPasswordUser(email, password) {
        try {

            const findUser = await User.findOne({ email }).exec()
            if (findUser) {

                const encryptedPassword = await bcrypt.hash(password, 10);
                findUser.password = encryptedPassword

                await findUser.save()

                const token = jwt.sign(
                    { isManager: findUser.isManager, email, id: findUser._id },
                    constants.TOKEN_KEY,
                    {
                        expiresIn: constants.ExpiresIn,
                    }
                )

                const userDTO = UserDTO.mapUserToUserDTO(findUser)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.LOGIN_SUCCESS,
                    userDTO,
                    token
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.NOT_FOUND_USER
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

    async login(email, password) {
        try {

            const user = await User.findOne({ email: email })
            if (user) {

                if (await bcrypt.compare(password, user.password)) {
                    const token = jwt.sign(
                        { isManager: user.isManager, email, id: user._id },
                        constants.TOKEN_KEY,
                        {
                            expiresIn: constants.ExpiresIn,
                        }
                    )

                    const userDTO = UserDTO.mapUserToUserDTO(user)

                    return new ServiceResponse(
                        200,
                        Status.SUCCESS,
                        Messages.LOGIN_SUCCESS,
                        userDTO,
                        token
                    )
                } else {
                    return new ServiceResponse(
                        401,
                        Status.ERROR,
                        Messages.PASSWORD_NOT_MATCHED,
                    )
                }
            } else {
                return new ServiceResponse(
                    401,
                    Status.ERROR,
                    Messages.EMAIL_NOT_REGISTERED
                )
            }

        } catch (err) {
            console.error(err)
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getProfileByEmail(email) {
        try {

            const user = await User.findOne({ email }).exec()

            const userDTO = UserDTO.mapUserToUserDTO(user)

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_PROFILE_SUCCESS,
                userDTO
            )

        } catch (err) {
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async sendEmail(to, subject, html, value) {
        return new Promise((resolve, reject) => {
            try {
                const mainOptions = {
                    from: constants.mailSender,
                    to: to,
                    subject: subject,
                    html: html
                }

                transporter.sendMail(mainOptions, (err) => {
                    if (err) {
                        resolve(new ServiceResponse(
                            400,
                            Status.ERROR,
                            Messages.SEND_EMAIL_ERROR
                        ));
                    } else {
                        resolve(new ServiceResponse(
                            200,
                            Status.SUCCESS,
                            Messages.SEND_EMAIL_SUCCESS,
                            value
                        ));
                    }
                });
            } catch (err) {
                reject(new ServiceResponse(
                    500,
                    Status.ERROR,
                    Messages.INTERNAL_SERVER
                ));
            }
        });
    }

    async loginWithFacebook(email, username, image, faceId) {
        try {

            const findUser = await User.findOne({ facebookId: faceId }).exec()

            if (findUser) {
                const token = jwt.sign(
                    { isManager: findUser.isManager, email, id: findUser._id },
                    constants.TOKEN_KEY,
                    {
                        expiresIn: constants.ExpiresIn,
                    }
                )

                const userDTO = UserDTO.mapUserToUserDTO(findUser)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.LOGIN_SUCCESS,
                    userDTO,
                    token
                )
            } else {
                const user = new User({
                    email: email,
                    fullName: username,
                    images: image,
                    facebookId: faceId
                })

                await user.save()
                const token = jwt.sign(
                    { isManager: user.isManager, email, id: user._id },
                    constants.TOKEN_KEY,
                    {
                        expiresIn: constants.ExpiresIn,
                    }
                )

                const userDTO = UserDTO.mapUserToUserDTO(user)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.LOGIN_SUCCESS,
                    userDTO,
                    token
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

    async register(email, password) {
        try {

            const oldUser = await User.findOne({ email })
            if (oldUser) {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.USER_EXISTS
                )
            } else {
                const encryptedPassword = await bcrypt.hash(password, 10);
                const user = new User({
                    email: email.toLowerCase(),
                    password: encryptedPassword
                })

                await user.save()
                const token = jwt.sign(
                    { isManager: user.isManager, email, id: user._id },
                    constants.TOKEN_KEY,
                    {
                        expiresIn: constants.ExpiresIn,
                    }
                )

                const userDTO = UserDTO.mapUserToUserDTO(user)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.REGISTER_SUCCESS,
                    userDTO,
                    token
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

    async getAllPagination(page, limit) {
        try {
            const userList = await User.find()
                .sort({ updateAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)

            const userDTOList = []
            userList.forEach((user) => {
                const userDTO = UserDTO.mapUserToUserDTO(user)
                userDTOList.push(userDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_USER_SUCCESS,
                userDTOList
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

    async getAllByTime(page, limit, firstTime, lastTime) {
        try {
            const userList = await User.find({ createAt: { $gte: firstTime, $lte: lastTime } })
                .sort({ updateAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)

            const userDTOList = []
            userList.forEach((user) => {
                const userDTO = UserDTO.mapUserToUserDTO(user)
                userDTOList.push(userDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_USER_SUCCESS,
                userDTOList
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

    async getAllByName(page, limit, name) {
        try {
            const userList = await User.find({ $text: { $search: name, $caseSensitive: false, $diacriticSensitive: false } })
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)

            const userDTOList = []
            userList.forEach((user) => {
                const userDTO = UserDTO.mapUserToUserDTO(user)
                userDTOList.push(userDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_USER_SUCCESS,
                userDTOList
            )
        } catch (err) {
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getAll() {
        try {

            const userList = await User.find().sort({ updatedAt: -1 }).exec()

            const userDTOList = []
            userList.forEach((user) => {
                const userDTO = UserDTO.mapUserToUserDTO(user)
                userDTOList.push(userDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_USER_SUCCESS,
                userDTOList
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
            const user = await User.findOne(field).exec()

            if (user) {
                const userDTO = UserDTO.mapUserToUserDTO(user)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.GET_ONE_USER_SUCCESS,
                    userDTO
                )
            } else {
                return new ServiceResponse(
                    404,
                    Status.ERROR,
                    Messages.NOT_FOUND_USER,
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

    async insert(value) {

        try {

            const findUser = await User.findOne({ email: value.email }).exec()

            if (findUser) {
                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.USER_EXISTS
                )
            } else {
                const user = new User({ ...value })
                const encryptedPassword = await bcrypt.hash(user.password, 10);
                user.password = encryptedPassword
                await user.save()

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.INSERT_USER_SUCCESS,
                    user
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

    async delete(id) {
        try {

            const user = await User.findByIdAndRemove({ _id: id }).exec()
            if (user) {
                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.REMOVE_USER_SUCCESS
                )
            } else {
                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.NOT_FOUND_USER
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

    async update(filter, newUser) {
        try {

            if (newUser.password) {
                const encryptedPassword = await bcrypt.hash(newUser.password, 10);
                newUser.password = encryptedPassword
            }

            const userUpdate = await User.findByIdAndUpdate(filter, newUser).exec()

            if (userUpdate) {

                const updatedUser = await User.findOne({ _id: userUpdate._id })
                const userDTO = UserDTO.mapUserToUserDTO(updatedUser)

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_USER_SUCCESS,
                    userDTO
                )
            } else {
                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.NOT_FOUND_USER
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

    async updateEmail(id, email) {
        try {

            const findUser = await User.findOne({ email })
            if (findUser) {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.EMAIL_IS_EXIST
                )
            } else {

                const userUpdate = await User.findByIdAndUpdate({ _id: id }, { email: email }).exec()

                if (userUpdate) {

                    const updatedUser = await User.findOne({ _id: userUpdate._id })
                    const userDTO = UserDTO.mapUserToUserDTO(updatedUser)

                    const token = jwt.sign(
                        { isManager: updatedUser.isManager, email, id: updatedUser._id },
                        constants.TOKEN_KEY,
                        {
                            expiresIn: constants.ExpiresIn,
                        }
                    )

                    return new ServiceResponse(
                        200,
                        Status.SUCCESS,
                        Messages.UPDATE_USER_SUCCESS,
                        userDTO,
                        token
                    )
                } else {
                    return new ServiceResponse(
                        400,
                        Status.ERROR,
                        Messages.NOT_FOUND_USER
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
}

module.exports = new UserService
