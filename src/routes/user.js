const express = require("express")
const router = express.Router()
const userController = require("../controllers/UserController")
const upload = require("../config/cloudinary")
const authentication = require("../middleware/Authentication")
const auhthorization = require("../middleware/Authorization")

router.get("/:id", auhthorization, userController.getUserById)
router.post("/insert", auhthorization, upload.single("images"), userController.insertUser)
router.delete("/delete/:id", auhthorization, userController.removeUser)
router.put("/update/:id", authentication, upload.single("images"), userController.updateUser)
router.post("/search", auhthorization, userController.getAllUserByName)
router.post("/", userController.getUserByEmail)
router.post("/filter/time", auhthorization, userController.getAllUserByTime)
router.get("/", auhthorization, userController.getAllUser)
router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/login/facebook", userController.loginWithFacebook)
router.post("/verify", userController.verifyOTP)
router.get("/get/profile", authentication, userController.getProfile)
router.post("/forgetpassword", userController.forgetPassword)
router.put("/email", authentication, userController.updateUserEmail)

module.exports = router