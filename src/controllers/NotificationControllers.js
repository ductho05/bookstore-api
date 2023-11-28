const NotificationService = require("../services/NotificationService")
const Response = require("../response/Response")
const Validator = require("../validator/Validator")
const Status = require("../utils/Status")

class NotificationControllers {

    async handlePushNotificationSubcription(req, res) {

        const subscription = req.body;
        const email = req.email

        const response = await NotificationService.pushSubscription(subscription, email)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async sendPushNotification(req, res) {

        const filter = req.body.filter
        const { error, value } = Validator.notificationValidator.validate(req.body.notification)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))

        } else {
            const response = await NotificationService.send(filter, value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async getAllNotificationsByUser(req, res) {

        const { error, value } = Validator.idValidator.validate(req.body.id)

        if (error) {

            res.status(400).json(new Response(
                Status.ERROR,
                error.message
            ))
        } else {

            const response = await NotificationService.getAllByUser(value)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        }
    }

    async getAllNotifications(req, res) {
        const response = await NotificationService.getAll()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }
}

module.exports = new NotificationControllers()
