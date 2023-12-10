const Notification = require("../models/Notification")
const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const User = require("../models/User")
const UserNotification = require("../models/UserNotification")
const configWebPush = require("../config/webpush")
const webpush = require('web-push')
const UserNotificationDTO = require("../dtos/UserNotificationDTO")

configWebPush()

class NotificationService {

    async pushSubscription(subscription, email) {

        try {

            const user = await User.findOne({ email })
            user.sw_id = subscription
            await user.save()

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.PUSH_SUBSCRIPTION_SUCCESS
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async send(filter, data) {

        try {

            const notification = new Notification({ ...data })

            await notification.save()
            if (filter === "all") {
                const listUsers = await User.find().exec()
                listUsers.forEach(async (user) => {
                    if (user.sw_id) {
                        webpush.sendNotification(
                            user.sw_id,
                            JSON.stringify(notification)
                        )
                    }
                    const userNotification = new UserNotification({
                        user: user._id,
                        notification: notification._id
                    })

                    await userNotification.save()
                })
            } else if (filter === 'admin') {
                const listUsers = await User.find().exec()
                listUsers.forEach(async (user) => {
                    if (user.isManager) {
                        if (user.sw_id) {
                            webpush.sendNotification(
                                user.sw_id,
                                JSON.stringify(notification)
                            )
                        }
                        const userNotification = new UserNotification({
                            user: user._id,
                            notification: notification._id
                        })

                        await userNotification.save()
                    }
                })
            } else {
                const user = await User.findOne({ _id: notification.user }).exec()

                if (user.sw_id) {
                    webpush.sendNotification(
                        user.sw_id,
                        JSON.stringify(notification)
                    )
                }
                const userNotification = new UserNotification({
                    user: user._id,
                    notification: notification._id
                })

                await userNotification.save()
            }

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.SEND_NOTICE_SUCCESS
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

    async getAllByUser(id) {

        try {

            const list = await UserNotification.find({ user: id })
                .populate("user")
                .populate("notification")
                .sort({ createdAt: -1 })
                .exec()

            const listDTO = []

            list.forEach(item => {
                const itemDTO = UserNotificationDTO.mapToUserNotificationDTO(item)

                listDTO.push(itemDTO)
            })

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                listDTO
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

            const list = await Notification.find()
                .sort({ createdAt: -1 })
                .exec()

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                list
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

    async update(id) {

        try {

            const userNotification = await UserNotification.findOne({ _id: id }).exec()
            userNotification.isAccess = true

            userNotification.save()
            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.UPDATE_DATA_SUCCESS
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }
}

module.exports = new NotificationService
