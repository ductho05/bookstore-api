const NotificationService = require("../services/NotificationService")
const Response = require("../response/Response")
const Validator = require("../validator/Validator")
const Status = require("../utils/Status")
const admin = require("../config/firebaseAdmin")

class NotificationControllers {

    async sendMobileNotification(req, res) {

        const deviceToken = req.params.token

        const message = {
            notification: {
                title: 'New Notification',
                body: 'This is a new notification',
            },
            token: deviceToken,
        };

        admin.messaging().send(message).then((response) => {
            console.log('Successfully sent message: ', response);
            res.status(200).json(response);
        })
            .catch((error) => {
                console.log('Error sending message: ', error);
                res.status(400).json(error);
            });
    }

    async handlePushNotificationSubcription(req, res) {

        const subscription = req.body.subscription
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
        const response = await NotificationService.send(filter, req.body.notification)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getAllNotificationsByUser(req, res) {

        const id = req.id

        const response = await NotificationService.getAllByUser(id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async getAllNotifications(req, res) {
        const response = await NotificationService.getAll()

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async updateUserNotification(req, res) {

        const id = req.body.id

        const response = await NotificationService.update(id)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }
}

module.exports = new NotificationControllers()
