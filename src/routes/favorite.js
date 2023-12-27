const express = require("express")
const router = express.Router()
const favoriteController = require("../controllers/FavoriteControllers")
const authentication = require("../middleware/Authentication")
//const upload = require("../config/cloudinary")

router.get("/", authentication, favoriteController.getAllFavorite)
router.post("/add", authentication, favoriteController.addFavorite)
router.post("/delete", authentication, favoriteController.deleteFavorite)
router.get("/check", authentication, favoriteController.checkFavorite)

module.exports = router
