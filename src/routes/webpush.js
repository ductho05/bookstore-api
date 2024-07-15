const express = require("express")
const router = express.Router()
const NotificationControllers = require('../controllers/NotificationControllers')
const authentication = require("../middleware/Authentication")
const auhthorization = require("../middleware/Authorization")

router.post("/subscription", authentication, NotificationControllers.handlePushNotificationSubcription)
router.post("/send", authentication, NotificationControllers.sendPushNotification)
router.post("/get", authentication, NotificationControllers.getAllNotificationsByUser)
router.get("/get-all", auhthorization, NotificationControllers.getAllNotifications)
router.put("/", authentication, NotificationControllers.updateUserNotification)
router.get("/send-mobile/:token", NotificationControllers.sendMobileNotification)

module.exports = router